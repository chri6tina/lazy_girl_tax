-- Fix: "column published does not exist" — your table was created without some fields.
-- Run this in Supabase → SQL Editor, then retry the index if it still fails.

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS excerpt text;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS body text NOT NULL DEFAULT '';

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS blog_posts_published_published_at_idx
  ON public.blog_posts (published, published_at DESC NULLS LAST);
