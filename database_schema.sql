-- Use nomes exclusivos para evitar conflitos com tabelas antigas

-- 1. Tabela do CRM (Leads capturados)
CREATE TABLE crm_leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'col-1', -- Controle do Kanban (col-1 até col-4)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tabela de Comentários das Aulas
CREATE TABLE lesson_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_avatar TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, replied
  reply_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar Políticas de Segurança Automáticas (RLS)
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários Admin (acesso total as tabelas)
CREATE POLICY "Allow all operations for authenticated users on crm_leads" ON crm_leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users on lesson_comments" ON lesson_comments FOR ALL USING (auth.role() = 'authenticated');

-- Permitir qualquer pessoa (anon) inserir Leads via formulário público de diagnóstico
CREATE POLICY "Allow anon insert to crm_leads" ON crm_leads FOR INSERT WITH CHECK (true);

-- Permitir que alunos anonimos possam enviar e visualizar comentários aprovados
CREATE POLICY "Allow anon insert to lesson_comments" ON lesson_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select to approved comments" ON lesson_comments FOR SELECT USING (status = 'approved' OR status = 'replied');
