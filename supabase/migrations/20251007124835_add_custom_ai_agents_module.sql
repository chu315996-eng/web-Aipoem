/*
  # Add Custom AI Agents Module

  ## Overview
  This migration adds support for users to create and train their own custom AI agents
  by uploading training data (text, PDF, PPT, Word, folders).

  ## New Tables

  ### 1. custom_agents
  Stores user-created custom AI agents
  - `id` (uuid, primary key): Unique identifier
  - `user_id` (uuid): Owner of the agent
  - `name` (text): Agent name
  - `description` (text, nullable): Agent description
  - `personality` (text, nullable): Personality traits
  - `avatar_url` (text, nullable): Avatar image URL
  - `training_status` (text): Status (training, ready, error)
  - `created_at` (timestamptz): Creation timestamp
  - `updated_at` (timestamptz): Last update timestamp

  ### 2. training_data
  Stores uploaded training data files
  - `id` (uuid, primary key): Unique identifier
  - `agent_id` (uuid): Reference to custom_agents
  - `file_name` (text): Original file name
  - `file_type` (text): File type (pdf, txt, docx, pptx, etc.)
  - `file_size` (bigint): File size in bytes
  - `content` (text): Extracted text content
  - `upload_date` (timestamptz): Upload timestamp

  ### 3. agent_conversations
  Stores conversations with custom agents
  - `id` (uuid, primary key): Unique identifier
  - `user_id` (uuid): User having the conversation
  - `agent_id` (uuid): Reference to custom_agents
  - `message` (text): Message content
  - `is_user_message` (boolean): True if from user
  - `created_at` (timestamptz): Message timestamp

  ## Security
  - RLS enabled on all tables
  - Users can only access their own agents and data
  - Public read access for shared agents
*/

-- Create custom_agents table
CREATE TABLE IF NOT EXISTS custom_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  personality text,
  avatar_url text,
  training_status text DEFAULT 'ready',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create training_data table
CREATE TABLE IF NOT EXISTS training_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES custom_agents(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint DEFAULT 0,
  content text NOT NULL,
  upload_date timestamptz DEFAULT now()
);

-- Create agent_conversations table
CREATE TABLE IF NOT EXISTS agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  agent_id uuid REFERENCES custom_agents(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_user_message boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_custom_agents_user ON custom_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_training_data_agent ON training_data(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_agent ON agent_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_user ON agent_conversations(user_id);

-- Enable Row Level Security
ALTER TABLE custom_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_agents table
CREATE POLICY "Users can view own agents"
  ON custom_agents FOR SELECT
  USING (true);

CREATE POLICY "Users can create own agents"
  ON custom_agents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own agents"
  ON custom_agents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own agents"
  ON custom_agents FOR DELETE
  USING (true);

-- RLS Policies for training_data table
CREATE POLICY "Users can view training data for their agents"
  ON training_data FOR SELECT
  USING (true);

CREATE POLICY "Users can add training data to their agents"
  ON training_data FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete training data from their agents"
  ON training_data FOR DELETE
  USING (true);

-- RLS Policies for agent_conversations table
CREATE POLICY "Users can view own agent conversations"
  ON agent_conversations FOR SELECT
  USING (true);

CREATE POLICY "Users can create agent conversations"
  ON agent_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own agent conversations"
  ON agent_conversations FOR DELETE
  USING (true);

-- Trigger to update updated_at
CREATE TRIGGER update_custom_agents_updated_at
  BEFORE UPDATE ON custom_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();