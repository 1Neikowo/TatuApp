-- ============================================================
-- TatuApp - Datos de ejemplo para testing
-- Ejecutar DESPUÉS de schema.sql en el SQL Editor de Supabase
-- ============================================================

-- Paso 1: Crear usuarios ficticios en auth.users
-- (el trigger on_auth_user_created creará los perfiles automáticamente)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'sofia@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"nombre_completo": "Sofía Blackwork", "rol": "tatuador"}'::jsonb, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'mateo@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"nombre_completo": "Mateo Realismo", "rol": "tatuador"}'::jsonb, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'lucas@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"nombre_completo": "Lucas Tradicional", "rol": "tatuador"}'::jsonb, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'valentina@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"nombre_completo": "Valentina Acuarela", "rol": "tatuador"}'::jsonb, NOW(), NOW());

-- Paso 2: Crear las identidades (necesario para que Supabase los reconozca)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '{"sub": "00000000-0000-0000-0000-000000000001", "email": "sofia@example.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '{"sub": "00000000-0000-0000-0000-000000000002", "email": "mateo@example.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '{"sub": "00000000-0000-0000-0000-000000000003", "email": "lucas@example.com"}'::jsonb, 'email', NOW(), NOW(), NOW()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', '{"sub": "00000000-0000-0000-0000-000000000004", "email": "valentina@example.com"}'::jsonb, 'email', NOW(), NOW(), NOW());

-- Paso 3: Actualizar los perfiles con datos completos
-- (el trigger ya creó los perfiles básicos, ahora les metemos la data de tatuador)

UPDATE perfiles SET
  bio = 'Especialista en líneas finas y blackwork. Tatuando desde 2018. Mi estilo se inspira en el arte geométrico y la naturaleza.',
  estilos = ARRAY['Blackwork', 'Fine Line', 'Dotwork', 'Geométrico'],
  galeria_urls = ARRAY[
    'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1590246814883-57c511e76846?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&h=400&fit=crop'
  ],
  foto_url = 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=200&h=200&fit=crop',
  instagram = 'sofia.blackwork',
  telefono = '+56912345678',
  disponibilidad = '{"dias_laborales": ["Martes", "Miércoles", "Jueves", "Viernes", "Sábado"], "proxima_fecha": "2026-03-15"}'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE perfiles SET
  bio = 'Fanático del realismo en sombras y color. Especialista en retratos y animales. 7 años de experiencia.',
  estilos = ARRAY['Realismo', 'Black & Grey', 'Color', 'Retratos'],
  galeria_urls = ARRAY[
    'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=400&fit=crop'
  ],
  foto_url = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=200&h=200&fit=crop',
  instagram = 'mateo.realismo',
  telefono = '+56987654321',
  disponibilidad = '{"dias_laborales": ["Lunes", "Martes", "Viernes"], "proxima_fecha": "2026-03-20"}'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE perfiles SET
  bio = 'Old School nunca muere. Colores sólidos y líneas gruesas. Especialista en diseños clásicos americanos y japoneses.',
  estilos = ARRAY['Tradicional', 'Old School', 'Japonés', 'Neotradicional'],
  galeria_urls = ARRAY[
    'https://images.unsplash.com/photo-1542556398-95fb5b9f9304?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop'
  ],
  foto_url = 'https://images.unsplash.com/photo-1542556398-95fb5b9f9304?w=200&h=200&fit=crop',
  instagram = 'lucas.trad',
  telefono = '+56911223344',
  disponibilidad = '{"dias_laborales": ["Miércoles", "Jueves", "Viernes", "Sábado"], "proxima_fecha": "2026-03-18"}'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE perfiles SET
  bio = 'Tatuajes con alma de acuarela. Flores, animales y diseños únicos llenos de color y vida.',
  estilos = ARRAY['Acuarela', 'Watercolor', 'Floral', 'Ilustración'],
  galeria_urls = ARRAY[
    'https://images.unsplash.com/photo-1569187990012-f1c3c345e45c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1604184956688-45e2e84e36c4?w=400&h=400&fit=crop'
  ],
  foto_url = 'https://images.unsplash.com/photo-1569187990012-f1c3c345e45c?w=200&h=200&fit=crop',
  instagram = 'vale.acuarela',
  telefono = '+56955667788',
  disponibilidad = '{"dias_laborales": ["Lunes", "Martes", "Miércoles", "Sábado"], "proxima_fecha": "2026-03-22"}'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000004';
