export interface Perfil {
    id: string;
    nombre_completo: string;
    correo: string;
    rol: 'cliente' | 'tatuador';
    telefono: string | null;
    instagram: string | null;
    foto_url: string | null;
    bio: string | null;
    estilos: string[];
    galeria_urls: string[];
    disponibilidad: {
        dias_laborales: string[];
        proxima_fecha: string | null;
    };
    datos_banco: {
        nombre?: string;
        rut?: string;
        banco?: string;
        tipo_cuenta?: string;
        numero?: string;
    };
    created_at: string;
}

export interface Cotizacion {
    id: string;
    cliente_id: string;
    tatuador_id: string;
    idea_descripcion: string;
    zona_cuerpo: string;
    tamano_cm: string;
    es_color: boolean;
    imagen_referencia_url: string | null;
    estado: 'pendiente' | 'cotizada' | 'aceptada' | 'rechazada';
    precio_ofrecido: number | null;
    monto_abono: number | null;
    mensaje_tatuador: string | null;
    created_at: string;
    // Joined data (optional, from queries with joins)
    cliente?: Perfil;
    tatuador?: Perfil;
}

export interface Cita {
    id: string;
    cotizacion_id: string;
    fecha_hora: string;
    duracion_estimada: number | null;
    comprobante_url: string | null;
    estado_pago: 'pendiente' | 'por_verificar' | 'pagado';
    estado_cita: 'confirmada' | 'realizada' | 'cancelada';
    created_at: string;
    // Joined data
    cotizacion?: Cotizacion;
}
