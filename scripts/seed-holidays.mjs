import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOLIDAYS_PATH = join(__dirname, "..", "src", "lib", "indonesian-holidays.json");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required");
  process.exit(1);
}

if (!existsSync(HOLIDAYS_PATH)) {
  console.error(`Error: ${HOLIDAYS_PATH} not found`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const data = JSON.parse(readFileSync(HOLIDAYS_PATH, "utf-8"));

const rows = [];
for (const [yearStr, holidays] of Object.entries(data)) {
  for (const h of holidays) {
    rows.push({
      source_id: h.id ?? null,
      date: h.date,
      name: h.name,
      type: h.type,
      year: parseInt(yearStr),
      is_holiday: h.is_holiday ?? true,
      is_joint_holiday: h.is_joint_holiday ?? false,
      is_observance: h.is_observance ?? false,
    });
  }
}

console.log(`Found ${rows.length} holiday rows to insert. Truncating existing data...`);

// Clear existing data
const { error: delErr } = await supabase.from("indonesian_holidays").delete().neq("year", 0);
if (delErr) {
  console.error("Error clearing table:", delErr.message);
  process.exit(1);
}

const BATCH_SIZE = 500;
for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  const { error } = await supabase.from("indonesian_holidays").insert(batch);
  if (error) {
    console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message);
    process.exit(1);
  }
  console.log(`  Inserted ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length} rows`);
}

console.log("Done! All holidays seeded to Supabase.");
