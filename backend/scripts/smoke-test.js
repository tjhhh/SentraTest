/* eslint-disable no-console */
const fetch = global.fetch;

async function run() {
  const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:4000";
  const res = await fetch(`${baseUrl}/api/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  const body = await res.json();
  console.log("Smoke test passed", body);
}

run().catch((error) => {
  console.error("Smoke test failed", error.message);
  process.exit(1);
});
