-- ============================================================
-- TatuApp - Schema completo
-- Ejecutar este SQL en el SQL Editor de Supabase
-- ============================================================

-- 1. Borrar tablas antiguas (datos de prueba)
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

-- 2. Borrar tablas nuevas si existen (para re-ejecución limpia)
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS cotizaciones CASCADE;
DROP TABLE IF EXISTS perfiles CASCADE;

-- ============================================================
-- TABLA: perfiles
-- Enlazada directamente a auth.users
-- ============================================================
CREATE TABLE perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  correo TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('cliente', 'tatuador')),
  telefono TEXT,
  instagram TEXT,
  foto_url TEXT,
  bio TEXT,
  estilos TEXT[] DEFAULT '{}',
  galeria_urls TEXT[] DEFAULT '{}',
  disponibilidad JSONB DEFAULT '{"dias_laborales": [], "proxima_fecha": null}'::jsonb,
  datos_banco JSONB DEFAULT '{}'::jsonb, -- para transferencias: nombre, rut, banco, tipo_cuenta, numero
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: cotizaciones
-- Una solicitud de un cliente a un tatuador
-- ============================================================
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  tatuador_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  idea_descripcion TEXT NOT NULL,
  zona_cuerpo TEXT NOT NULL,
  tamano_cm TEXT NOT NULL,
  es_color BOOLEAN DEFAULT FALSE,
  imagen_referencia_url TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'cotizada', 'aceptada', 'rechazada')),
  precio_ofrecido INTEGER,  -- en pesos, lo llena el tatuador
  monto_abono INTEGER,      -- lo define el tatuador
  mensaje_tatuador TEXT,     -- respuesta/comentario del tatuador
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLA: citas
-- Se crea cuando una cotización es aceptada y pagada
-- ============================================================
CREATE TABLE citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id UUID NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  fecha_hora TIMESTAMPTZ NOT NULL,
  duracion_estimada INTEGER, -- en minutos
  comprobante_url TEXT,
  estado_pago TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado_pago IN ('pendiente', 'por_verificar', 'pagado')),
  estado_cita TEXT NOT NULL DEFAULT 'confirmada'
    CHECK (estado_cita IN ('confirmada', 'realizada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: crear perfil automáticamente al registrarse
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, correo, nombre_completo, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

-- PERFILES
CREATE POLICY "Perfiles visibles públicamente"
  ON perfiles FOR SELECT USING (true);

CREATE POLICY "Usuarios editan su propio perfil"
  ON perfiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Trigger puede insertar perfiles"
  ON perfiles FOR INSERT WITH CHECK (true);

-- COTIZACIONES
CREATE POLICY "Participantes ven sus cotizaciones"
  ON cotizaciones FOR SELECT
  USING (auth.uid() = cliente_id OR auth.uid() = tatuador_id);

CREATE POLICY "Clientes crean cotizaciones"
  ON cotizaciones FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Tatuadores actualizan cotizaciones"
  ON cotizaciones FOR UPDATE
  USING (auth.uid() = tatuador_id);

CREATE POLICY "Clientes actualizan estado de cotizaciones"
  ON cotizaciones FOR UPDATE
  USING (auth.uid() = cliente_id);

-- CITAS
CREATE POLICY "Participantes ven citas"
  ON citas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM cotizaciones c
    WHERE c.id = citas.cotizacion_id
    AND (c.cliente_id = auth.uid() OR c.tatuador_id = auth.uid())
  ));

CREATE POLICY "Tatuadores crean citas"
  ON citas FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM cotizaciones c
    WHERE c.id = cotizacion_id
    AND c.tatuador_id = auth.uid()
  ));

CREATE POLICY "Participantes actualizan citas"
  ON citas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM cotizaciones c
    WHERE c.id = citas.cotizacion_id
    AND (c.cliente_id = auth.uid() OR c.tatuador_id = auth.uid())
  ));

-- ============================================================
-- STORAGE: Bucket para imágenes
-- (Ejecutar en la sección Storage de Supabase o via SQL)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Usuarios autenticados suben imágenes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'imagenes');

CREATE POLICY "Imágenes públicamente visibles"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'imagenes');
