-- ==========================================
-- SUPER LMS E CENTRAL DE ALUNOS PARTE 2
-- ==========================================

-- 1. Tabela de Estudantes (CRM de Alunos)
CREATE TABLE students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Se houver autenticacao
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active', -- active, inactive, blocked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Tabela de Cursos (Categorias Principais)
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Tabela de Módulos (Sub-categorias)
CREATE TABLE course_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Tabela de Aulas (Conteúdo Final)
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT, -- Aceita link do YouTube/Vimeo/Panda ou URL direta de um .mp4 no Bucket
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Tabela de Progresso do Aluno (Assistidos)
CREATE TABLE lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(student_id, lesson_id)
);

-- Habilitar Políticas de Segurança Automáticas (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários Admin (Acesso Total para os donos da plataforma)
CREATE POLICY "Allow all operations for auth users on students" ON students FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for auth users on courses" ON courses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for auth users on course_modules" ON course_modules FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for auth users on lessons" ON lessons FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for auth users on lesson_progress" ON lesson_progress FOR ALL USING (auth.role() = 'authenticated');

-- Permitir Leitura Pública (Anon) dos Cursos Ativos para vitrine / alunos não logados
CREATE POLICY "Allow public read on published courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read on modules" ON course_modules FOR SELECT USING (true);
CREATE POLICY "Allow public read on published lessons" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public insert on students" ON students FOR INSERT WITH CHECK (true); -- para cadastro
