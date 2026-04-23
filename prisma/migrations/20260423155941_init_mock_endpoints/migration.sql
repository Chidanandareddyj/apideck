-- CreateTable
CREATE TABLE "mock_endpoints" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "label" TEXT,
    "response" JSONB NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "expires_at" TIMESTAMPTZ(6),
    "cors" BOOLEAN NOT NULL DEFAULT true,
    "hit_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mock_endpoints_slug_key" ON "mock_endpoints"("slug");
