CREATE UNIQUE INDEX "Application_one_pending_per_student"
ON "Application" ("studentId")
WHERE "status" = 'Pending';
