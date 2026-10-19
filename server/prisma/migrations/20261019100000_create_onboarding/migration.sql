-- CreateTable
CREATE TABLE "onboarding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "avatarTone" TEXT NOT NULL DEFAULT 'zinc',
    "teamSize" TEXT NOT NULL DEFAULT 'team',
    "useCase" TEXT NOT NULL DEFAULT 'saas',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "onboarding_slug_key" ON "onboarding"("slug");

-- CreateIndex
CREATE INDEX "onboarding_userId_idx" ON "onboarding"("userId");
