'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';

interface UploadComprobanteProps {
    cotizacionId: string;
}

export const UploadComprobante: React.FC<UploadComprobanteProps> = ({ cotizacionId }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleAcceptAndUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            setIsUploading(true);
            try {
                const supabase = createClient();

                // First accept the cotización
                await supabase
                    .from('cotizaciones')
                    .update({ estado: 'aceptada' })
                    .eq('id', cotizacionId);

                // Upload comprobante to storage
                const fileExt = file.name.split('.').pop();
                const fileName = `comprobantes/${cotizacionId}_${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('imagenes')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('imagenes')
                    .getPublicUrl(fileName);

                // Create the cita with comprobante
                const { error: citaError } = await supabase.from('citas').insert({
                    cotizacion_id: cotizacionId,
                    fecha_hora: new Date().toISOString(), // Placeholder, tattoo artist will set the real date
                    comprobante_url: publicUrl,
                    estado_pago: 'por_verificar',
                    estado_cita: 'confirmada',
                });

                if (citaError) throw citaError;

                setUploaded(true);
                // Refresh the page to show updated state
                window.location.reload();
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error. Por favor intenta nuevamente.');
            } finally {
                setIsUploading(false);
            }
        };

        input.click();
    };

    if (uploaded) {
        return (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✅ Comprobante subido. El tatuador lo verificará pronto.
            </p>
        );
    }

    return (
        <Button
            onClick={handleAcceptAndUpload}
            disabled={isUploading}
            size="sm"
        >
            {isUploading ? 'Subiendo...' : '📎 Aceptar y Subir Comprobante'}
        </Button>
    );
};
