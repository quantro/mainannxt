import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOLIDAYS_PATH = join(__dirname, "..", "src", "lib", "indonesian-holidays.json");
const BASE_URL = "https://use.api.co.id/holidays/indonesia/";
const API_KEY = process.env.API_CO_ID_KEY;

if (!API_KEY) {
  console.error("Error: API_CO_ID_KEY environment variable is required");
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  let from = NaN;
  let to = NaN;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--from" && i + 1 < args.length) {
      from = parseInt(args[++i]);
    } else if (args[i] === "--to" && i + 1 < args.length) {
      to = parseInt(args[++i]);
    }
  }
  if (isNaN(from)) {
    const now = new Date();
    from = now.getFullYear();
    to = from;
  }
  if (isNaN(to)) {
    to = from;
  }
  if (from > to) [from, to] = [to, from];
  return { from, to };
}

async function fetchYear(year) {
  const params = new URLSearchParams({
    year: String(year),
    start_date: `${year}-01-01`,
    end_date: `${year}-12-31`,
    page: "1",
  });

  const allItems = [];
  let page = 1;
  let totalPage = 1;

  while (page <= totalPage) {
    params.set("page", String(page));
    const url = `${BASE_URL}?${params}`;
    const resp = await fetch(url, {
      headers: { accept: "application/json", "x-api-co-id": API_KEY },
    });
    if (!resp.ok) {
      throw new Error(`API error for ${year} page ${page}: ${resp.status}`);
    }
    const data = await resp.json();
    const items = data?.data ?? [];
    allItems.push(...items);
    totalPage = data?.paging?.total_page ?? 1;
    page++;
  }

  console.log(`  → ${allItems.length} holidays for ${year}`);
  return allItems;
}

async function main() {
  const { from, to } = parseArgs();
  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  console.log(`Fetching holidays for years ${from}–${to}...`);

  // Load existing data to preserve years outside the fetch range
  let existing = {};
  if (existsSync(HOLIDAYS_PATH)) {
    existing = JSON.parse(readFileSync(HOLIDAYS_PATH, "utf-8"));
  }

  for (const year of years) {
    try {
      existing[String(year)] = await fetchYear(year);
    } catch (err) {
      console.error(`  ✗ Failed for ${year}: ${err.message}`);
    }
  }

  // Sort keys numerically
  const sorted = Object.keys(existing)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .reduce((acc, k) => ({ ...acc, [k]: existing[k] }), {});

  writeFileSync(HOLIDAYS_PATH, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Updated ${HOLIDAYS_PATH} (${Object.keys(sorted).length} years)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
