ALTER TABLE "user" ADD COLUMN "is_superadmin" boolean NOT NULL DEFAULT false;
ALTER TABLE "user" ADD CONSTRAINT users_superadmin_requires_admin
CHECK (is_superadmin = false OR role = 'admin');
