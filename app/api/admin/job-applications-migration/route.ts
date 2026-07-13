import { NextResponse } from "next/server";

const SQL = `
-- job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  talent_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  reject_reason TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, talent_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS job_applications_job_id_idx    ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS job_applications_talent_id_idx ON job_applications(talent_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx    ON job_applications(status);

-- RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "talent sees own applications"  ON job_applications;
DROP POLICY IF EXISTS "brand sees job applications"   ON job_applications;
DROP POLICY IF EXISTS "talent inserts own application" ON job_applications;
DROP POLICY IF EXISTS "brand updates application status" ON job_applications;

CREATE POLICY "talent sees own applications"
  ON job_applications FOR SELECT
  USING (talent_id = auth.uid());

CREATE POLICY "brand sees job applications"
  ON job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.brand_id = auth.uid()
    )
  );

CREATE POLICY "talent inserts own application"
  ON job_applications FOR INSERT
  WITH CHECK (talent_id = auth.uid());

CREATE POLICY "brand updates application status"
  ON job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.brand_id = auth.uid()
    )
  );
`;

export async function GET() {
  return new NextResponse(SQL, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
