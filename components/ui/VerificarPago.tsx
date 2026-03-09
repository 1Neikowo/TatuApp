'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';

interface VerificarPagoProps {
    citaId: string;
}

export const VerificarPago: React.FC<VerificarPagoProps> = ({ citaId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('citas')
                .update({ estado_pago: 'pagado' })
                .eq('id', citaId);

            if (error) throw error;

            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button size="sm" onClick={handleVerify} disabled={isLoading}>
            {isLoading ? 'Verificando...' : '✅ Confirmar Pago'}
        </Button>
    );
};
