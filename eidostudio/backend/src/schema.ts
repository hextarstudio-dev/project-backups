export const supabaseSchema = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hub_users (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    role TEXT,
    avatar_url TEXT DEFAULT 'https://cdn.eidostudio.com.br/assets/logos/isotipo-preto-2.svg',
    avatar_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    image_url TEXT,
    image_key TEXT,
    items TEXT DEFAULT '[]', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hub_products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    duration_label TEXT,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hub_lessons (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES hub_products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    duration TEXT,
    url TEXT,
    description TEXT,
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client TEXT,
    category_id TEXT REFERENCES categories(id),
    date TEXT,
    description TEXT,
    cover_image_url TEXT,
    card_image_url TEXT,
    cover_image_key TEXT,
    card_image_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_sections (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    layout TEXT,
    image_format TEXT,
    slides_count INTEGER,
    colors TEXT, 
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_images (
    id TEXT PRIMARY KEY,
    section_id TEXT REFERENCES project_sections(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    image_key TEXT,
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS hub_comments (
    id TEXT PRIMARY KEY, 
    lesson_id TEXT NOT NULL, 
    user_id TEXT NOT NULL, 
    content TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hub_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, email, password_hash, name, role) 
VALUES ('admin-001','admin@eidostudio.com.br','admin123','Admin Eidos Studio','admin') 
ON CONFLICT (id) DO NOTHING;

INSERT INTO hub_users (user_id, name, email, role, avatar_url)
VALUES ('admin-001','Admin Eidos Studio','admin@eidostudio.com.br','Admin','https://cdn.eidostudio.com.br/assets/logos/isotipo-preto-2.svg') 
ON CONFLICT (user_id) DO NOTHING;
`;
