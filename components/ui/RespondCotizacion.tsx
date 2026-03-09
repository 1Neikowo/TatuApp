'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';

interface RespondCotizacionProps {
    cotizacionId: string;
}

export const RespondCotizacion: React.FC<RespondCotizacionProps> = ({ cotizacionId }) => {
    const [precio, setPrecio] = useState('');
    const [abono, setAbono] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRespond = async () => {
        if (!precio || !abono) {
            alert('Debes ingresar el precio y el monto del abono.');
            return;
        }

        setIsSubmitting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('cotizaciones')
                .update({
                    estado: 'cotizada',
                    precio_ofrecido: parseInt(precio),
                    monto_abono: parseInt(abono),
                    mensaje_tatuador: mensaje || null,
                })
                .eq('id', cotizacionId);

            if (error) throw error;

            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al responder. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        setIsSubmitting(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('cotizaciones')
                .update({ estado: 'rechazada', mensaje_tatuador: mensaje || 'No disponible en este momento.' })
                .eq('id', cotizacionId);

            if (error) throw error;

            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800 dark:border-gray-700">
            <h4 className="text-sm font-semibold dark:text-white">Responder</h4>
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400">Precio Total ($)</label>
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="50000"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400">Monto Abono ($)</label>
                <input
                    type="number"
                    value={abono}
                    onChange={(e) => setAbono(e.target.value)}
                    placeholder="10000"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400">Mensaje (opcional)</label>
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    rows={2}
                    placeholder="Detalles o comentarios..."
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div className="flex gap-2">
                <Button size="sm" onClick={handleRespond} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? '...' : '💰 Cotizar'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleReject} disabled={isSubmitting}>
                    ❌
                </Button>
            </div>
        </div>
    );
};
