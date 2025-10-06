/*
  # Add Ancient Poets Module

  ## Overview
  This migration adds support for an ancient poets AI agent module where users can
  have conversations with famous historical Chinese poets.

  ## New Tables

  ### 1. ancient_poets
  Stores information about famous ancient Chinese poets
  - `id` (uuid, primary key): Unique identifier
  - `name` (text): Poet's name (e.g., "李白", "杜甫")
  - `dynasty` (text): Dynasty period (e.g., "唐代", "宋代")
  - `title` (text): Title/epithet (e.g., "诗仙", "诗圣")
  - `bio` (text): Brief biography
  - `style_description` (text): Description of their poetic style
  - `famous_works` (text[]): Array of famous poem titles
  - `personality_traits` (text[]): Array of personality characteristics
  - `avatar_url` (text, nullable): Avatar image URL
  - `created_at` (timestamptz): Creation timestamp

  ### 2. poet_conversations
  Stores user conversations with ancient poets
  - `id` (uuid, primary key): Unique identifier
  - `user_id` (uuid): User having the conversation
  - `poet_id` (uuid): Reference to ancient_poets table
  - `message` (text): The message content
  - `is_user_message` (boolean): True if from user, false if from poet
  - `created_at` (timestamptz): Message timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for poets data
  - Users can only view their own conversations
  - Users can create conversations

  ## Initial Data
  Populated with famous Chinese poets: 李白, 杜甫, 苏轼, 李清照, 白居易, 王维
*/

-- Create ancient_poets table
CREATE TABLE IF NOT EXISTS ancient_poets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dynasty text NOT NULL,
  title text,
  bio text NOT NULL,
  style_description text NOT NULL,
  famous_works text[] DEFAULT '{}',
  personality_traits text[] DEFAULT '{}',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create poet_conversations table
CREATE TABLE IF NOT EXISTS poet_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  poet_id uuid REFERENCES ancient_poets(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_user_message boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON poet_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_poet ON poet_conversations(poet_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created ON poet_conversations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ancient_poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE poet_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ancient_poets table (public read)
CREATE POLICY "Anyone can view ancient poets"
  ON ancient_poets FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for poet_conversations table
CREATE POLICY "Users can view their own conversations"
  ON poet_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON poet_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own conversations"
  ON poet_conversations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert famous ancient Chinese poets
INSERT INTO ancient_poets (name, dynasty, title, bio, style_description, famous_works, personality_traits, avatar_url) VALUES
(
  '李白',
  '唐代',
  '诗仙',
  '李白（701年-762年），字太白，号青莲居士，是唐代伟大的浪漫主义诗人。其诗风雄奇飘逸，想象丰富，语言流转自然，音律和谐多变，被誉为"诗仙"。',
  '诗风豪放飘逸，想象瑰丽，善用夸张手法，追求自由不羁的精神境界。',
  ARRAY['《静夜思》', '《将进酒》', '《望庐山瀑布》', '《早发白帝城》', '《蜀道难》'],
  ARRAY['豪放不羁', '浪漫洒脱', '才华横溢', '热爱自然', '追求自由'],
  null
),
(
  '杜甫',
  '唐代',
  '诗圣',
  '杜甫（712年-770年），字子美，自号少陵野老，是唐代伟大的现实主义诗人。其诗被称为"诗史"，深刻反映了唐代由盛转衰的历史时期，展现了深厚的人文关怀。',
  '诗风沉郁顿挫，语言精炼，格律严谨，善于描写社会现实和民生疾苦。',
  ARRAY['《春望》', '《登高》', '《茅屋为秋风所破歌》', '《三吏三别》', '《月夜》'],
  ARRAY['忧国忧民', '关怀民生', '严谨认真', '深沉内敛', '忠厚仁爱'],
  null
),
(
  '苏轼',
  '宋代',
  '东坡居士',
  '苏轼（1037年-1101年），字子瞻，号东坡居士，是北宋著名文学家、书画家。他才华横溢，诗词文赋无一不精，开创了豪放词派，对后世影响深远。',
  '诗词豪放清新，既有豪迈气概，又不失细腻情感，善于在日常生活中发现诗意。',
  ARRAY['《水调歌头·明月几时有》', '《念奴娇·赤壁怀古》', '《江城子·密州出猎》', '《题西林壁》', '《饮湖上初晴后雨》'],
  ARRAY['豁达乐观', '才华横溢', '热爱生活', '善于自嘲', '洒脱自在'],
  null
),
(
  '李清照',
  '宋代',
  '易安居士',
  '李清照（1084年-约1155年），号易安居士，是宋代著名女词人，婉约派代表。她的词清新婉约，善于表达细腻的情感，被誉为"千古第一才女"。',
  '词风婉约细腻，语言清新自然，善于刻画内心情感和生活细节。',
  ARRAY['《声声慢》', '《如梦令》', '《一剪梅》', '《醉花阴》', '《夏日绝句》'],
  ARRAY['才情出众', '细腻敏感', '坚韧不屈', '热爱生活', '真挚深情'],
  null
),
(
  '白居易',
  '唐代',
  '香山居士',
  '白居易（772年-846年），字乐天，号香山居士，是唐代伟大的现实主义诗人。他提倡"文章合为时而著，歌诗合为事而作"，诗歌通俗易懂，关注民生。',
  '诗风平易近人，语言通俗流畅，善于用诗歌反映社会现实和百姓生活。',
  ARRAY['《长恨歌》', '《琵琶行》', '《赋得古原草送别》', '《钱塘湖春行》', '《问刘十九》'],
  ARRAY['平易近人', '关心民生', '通达豁达', '真诚直率', '热爱生活'],
  null
),
(
  '王维',
  '唐代',
  '诗佛',
  '王维（701年-761年），字摩诘，号摩诘居士，是唐代著名诗人、画家。他精通诗画，诗中有画，画中有诗，作品清新淡雅，富有禅意，被称为"诗佛"。',
  '诗风清新淡雅，善于描绘山水田园，意境深远，充满禅意和哲理。',
  ARRAY['《山居秋暝》', '《相思》', '《竹里馆》', '《鹿柴》', '《送元二使安西》'],
  ARRAY['淡泊宁静', '富有禅意', '热爱自然', '文雅温和', '超然物外'],
  null
);
