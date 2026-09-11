DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  event_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  place TEXT,
  event_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table – camelCase to match frontend code
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endTime" TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies – users can only see/manage their own data
CREATE POLICY "Users can only see their own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own logs"
  ON logs
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own sessions"
  ON sessions
  FOR ALL
  USING (auth.uid() = user_id);

-- GIN indexes on tags for future tag-based filtering / analytics.
-- Cheap to add now, no cost if unused.
CREATE INDEX IF NOT EXISTS transactions_tags_idx ON transactions USING GIN (tags);
CREATE INDEX IF NOT EXISTS logs_tags_idx         ON logs         USING GIN (tags);
CREATE INDEX IF NOT EXISTS sessions_tags_idx     ON sessions     USING GIN (tags);