import { Router } from "express";
import { leadsController } from "./leads.controller";

const router: Router = Router();

// ==========================================
// LEADS QUERY & BULK ACTIONS
// ==========================================
router.get("/", leadsController.getLeads);
router.post("/simulate", leadsController.simulateLead);
router.post("/bulk-delete", leadsController.batchDeleteLeads);
router.post("/bulk-status", leadsController.batchUpdateLeadStatus);

// ==========================================
// SINGLE LEAD ACTIONS
// ==========================================
router.get("/:id", leadsController.getLeadById);
router.patch("/:id/status", leadsController.updateLeadStatus);
router.delete("/:id", leadsController.deleteLead);

export { router as leadsRouter };
export default router;

