ALTER TABLE "sample"."post" ADD COLUMN "slug" varchar(256) DEFAULT 'untitled' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "description" varchar(240) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "category" varchar(32) DEFAULT 'notes' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "status" varchar(32) DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "locale" varchar(8) DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "translation_key" varchar(256) DEFAULT 'untitled' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "image" text DEFAULT '/blog/editorial-workspace.jpg' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "image_alt" varchar(240) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "sample"."post" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
UPDATE "sample"."post"
SET
  "slug" = 'migrated-' || "id"::text,
  "translation_key" = 'migrated-' || "id"::text,
  "description" = 'Migrated content. Add an editorial description before publishing.',
  "image_alt" = 'Editorial image';--> statement-breakpoint
CREATE UNIQUE INDEX "post_locale_slug_uidx" ON "sample"."post" USING btree ("locale","slug");
