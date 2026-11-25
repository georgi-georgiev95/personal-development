CREATE TABLE IF NOT EXISTS planner_usage (
  day TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  token_hashes TEXT NOT NULL
);
