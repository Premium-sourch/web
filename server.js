// Set safe defaults before the app loads
process.env.PORT = process.env.PORT || "3000";
process.env.NODE_ENV = process.env.NODE_ENV || "production";

import("./dist/index.mjs").catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
