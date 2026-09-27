// Regenerates supabase/SCHEMA.sql — the complete schema as one ordered script — from the
// numbered migrations. Run after adding a migration:  npm run schema:build
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "supabase/migrations";
const files = readdirSync(dir).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort();
const header = `-- ============================================================================
-- RENYXERA — complete database schema (Supabase Postgres)
-- ============================================================================
-- This file is the ordered migration history (supabase/migrations/${files[0].slice(0, 4)}…${files[files.length - 1].slice(0, 4)}) as one
-- script. On a NEW Supabase project, run it top to bottom in the SQL Editor to recreate
-- the full schema. Never edit it by hand: add a new numbered migration, then regenerate:
--   npm run schema:build
-- Human-readable explanation of every table, policy and function: docs/TECHNICAL_REFERENCE.md §6
-- ============================================================================
`;
const body = files
  .map((f) => `\n\n-- ${"#".repeat(76)}\n-- ##  ${f}\n-- ${"#".repeat(76)}\n\n${readFileSync(`${dir}/${f}`, "utf8")}`)
  .join("");
writeFileSync("supabase/SCHEMA.sql", header + body);
console.log(`supabase/SCHEMA.sql rebuilt from ${files.length} migrations`);
