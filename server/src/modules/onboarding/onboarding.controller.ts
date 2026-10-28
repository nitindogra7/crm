import type { Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { getAuth, clerkClient } from "@clerk/express";
import { onboardingService, OnboardingService } from "./onboarding.service";
import {
  createOnboardingSchema,
  updateOnboardingSchema,
  getOnboardingByUserIdSchema,
  checkSlugAvailabilitySchema,
} from "./onboarding.validation";

export class OnboardingController {
  constructor(private readonly service: OnboardingService = onboardingService) {}

  checkSlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const rawSlug = (req.query.slug as string) || req.params.slug;
      // Authoritative authenticated user ID takes precedence to prevent probing
      const userId = auth?.userId || (req.query.userId as string);

      if (!rawSlug || typeof rawSlug !== "string" || !rawSlug.trim()) {
        res.status(400).json({
          success: false,
          available: false,
          error: "Slug query parameter is required (e.g. ?slug=acme-studio)",
        });
        return;
      }

      const validated = checkSlugAvailabilitySchema.parse({
        slug: rawSlug.trim().toLowerCase(),
        ...(userId && { userId }),
      });

      const result = await this.service.checkSlugAvailability(
        validated.slug,
        validated.userId
      );

      res.status(200).json({
        success: true,
        available: result.available,
        slug: result.slug,
        message: result.available
          ? "Slug is available"
          : "Slug is already taken",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          available: false,
          error: "Invalid slug format",
          details: error.issues.map((issue) => issue.message),
        });
        return;
      }

      console.error("Error checking slug availability:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check slug availability",
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Extract Clerk Auth data from Clerk middleware
      const auth = getAuth(req);
      const authUserId = auth?.userId;

      // Strictly require Clerk authentication to prevent IDOR / unauthorized tampering
      if (!authUserId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Please log in with Clerk to complete onboarding",
        });
        return;
      }

      // If user ID was sent in body, it must match the authenticated token
      if (req.body.userId && req.body.userId !== authUserId) {
        res.status(403).json({
          success: false,
          error: "Forbidden: Cannot submit onboarding for a different user ID",
        });
        return;
      }

      const userId = authUserId;
      let ownerEmail = req.body.ownerEmail;

      // If email is missing from body, enrich it directly using Clerk backend SDK
      if (!ownerEmail) {
        try {
          const clerkUser = await clerkClient.users.getUser(authUserId);
          ownerEmail =
            clerkUser.emailAddresses.find(
              (e) => e.id === clerkUser.primaryEmailAddressId
            )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;
        } catch (err) {
          console.warn("Could not retrieve Clerk user email:", err);
        }
      }

      const payload = {
        ...req.body,
        userId,
        ...(ownerEmail && { ownerEmail }),
      };

      const validated = createOnboardingSchema.parse(payload);
      const record = await this.service.completeOnboarding(validated);

      // Update Clerk user public metadata
      try {
        await clerkClient.users.updateUserMetadata(authUserId, {
          publicMetadata: {
            isOnboarded: true,
          },
        });
      } catch (clerkErr) {
        console.warn("Could not update Clerk user metadata:", clerkErr);
      }

      res.status(201).json({
        success: true,
        message: "Onboarding completed successfully",
        data: record,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        res.status(409).json({
          success: false,
          error: "The chosen workspace slug is already taken. Please choose a different slug.",
        });
        return;
      }

      console.error("Error creating onboarding record:", error);
      res.status(500).json({
        success: false,
        error: "Failed to complete onboarding",
      });
    }
  };

  getStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const authUserId = auth?.userId;
      const requestedUserId = (req.query.userId as string) || req.params.userId;

      // Strictly require Clerk authentication to prevent public PII / status leaks
      if (!authUserId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Clerk authentication token is required",
        });
        return;
      }

      // Prevent users from checking another user's onboarding status
      if (requestedUserId && requestedUserId !== authUserId) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You cannot check onboarding status for another user",
        });
        return;
      }

      const validated = getOnboardingByUserIdSchema.parse({ userId: authUserId });
      const status = await this.service.getOnboardingStatus(validated.userId);

      res.status(200).json({
        success: true,
        isOnboarded: status.isOnboarded,
        onboarding: status.onboarding,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
          details: error.issues,
        });
        return;
      }

      console.error("Error fetching onboarding status:", error);
      res.status(500).json({
        success: false,
        error: "Failed to check onboarding status",
      });
    }
  };

  getByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const authUserId = auth?.userId;
      const rawUserId = req.params.userId;
      const targetUserId =
        rawUserId === "me" || rawUserId === "current" ? authUserId : rawUserId;

      if (!authUserId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Please log in with Clerk to view workspace record",
        });
        return;
      }

      // Tenant isolation: users can only view their own record
      if (authUserId !== targetUserId) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You cannot view another user's workspace record",
        });
        return;
      }

      const { userId } = getOnboardingByUserIdSchema.parse({ userId: targetUserId });
      const record = await this.service.getByUserId(userId);

      if (!record) {
        res.status(404).json({
          success: false,
          error: "Onboarding record not found for this user",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID parameter",
          details: error.issues,
        });
        return;
      }

      console.error("Error retrieving onboarding record:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve onboarding record",
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const authUserId = auth?.userId;
      const rawUserId = req.params.userId;
      const targetUserId =
        rawUserId === "me" || rawUserId === "current" ? authUserId : rawUserId;

      if (!authUserId) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: Please log in with Clerk to update workspace",
        });
        return;
      }

      // Tenant isolation: users can only update their own record
      if (authUserId !== targetUserId) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You cannot modify another user's workspace record",
        });
        return;
      }

      const { userId } = getOnboardingByUserIdSchema.parse({ userId: targetUserId });
      const updates = updateOnboardingSchema.parse(req.body);

      const updated = await this.service.updateOnboarding(userId, updates);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Onboarding record not found for update",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Onboarding updated successfully",
        data: updated,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues,
        });
        return;
      }

      console.error("Error updating onboarding record:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update onboarding record",
      });
    }
  };
}

export const onboardingController = new OnboardingController();
