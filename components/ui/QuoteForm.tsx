'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Perfil } from '@/types';
import { createClient } from '@/lib/supabase';

interface QuoteFormProps {
    artist: Perfil;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ artist }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [needsAuth, setNeedsAuth] = useState(false);
    const [formData, setFormData] = useState({
        zona_cuerpo: '',
        tamano_cm: '',
        es_color: 'false',
        idea_descripcion: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const supabase = createClient();

            // Check if user is logged in
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setNeedsAuth(true);
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase.from('cotizaciones').insert({
                cliente_id: user.id,
                tatuador_id: artist.id,
                idea_descripcion: formData.idea_descripcion,
                zona_cuerpo: formData.zona_cuerpo,
                tamano_cm: formData.tamano_cm,
                es_color: formData.es_color === 'true',
                estado: 'pendiente',
            });

            if (error) throw error;

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Hubo un error al enviar la cotización. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (needsAuth) {
        return (
            <div className="rounded-lg border bg-yellow-50 p-8 text-center text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-900">
                <h3 className="mb-2 text-2xl font-bold">Necesitas una cuenta</h3>
                <p>Para enviar una cotización, primero debes crear una cuenta o iniciar sesión.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button
                        onClick={() => window.location.href = '/register'}
                    >
                        Crear Cuenta
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/login'}
                        variant="outline"
                    >
                        Iniciar Sesión
                    </Button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="rounded-lg border bg-green-50 p-8 text-center text-green-900 dark:bg-green-900/30 dark:text-green-200 dark:border-green-900">
                <h3 className="mb-2 text-2xl font-bold">¡Solicitud Enviada!</h3>
                <p>Tu cotización ha sido enviada a {artist.nombre_completo}. Te responderá con un precio pronto.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button
                        onClick={() => window.location.href = '/mis-cotizaciones'}
                    >
                        Ver Mis Cotizaciones
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                    >
                        Volver al inicio
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold dark:text-white">Cotizar con {artist.nombre_completo}</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zona del Cuerpo</label>
                    <input
                        required
                        type="text"
                        name="zona_cuerpo"
                        placeholder="Ej: Antebrazo, Espalda..."
                        value={formData.zona_cuerpo}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño Aproximado (cm)</label>
                    <input
                        required
                        type="text"
                        name="tamano_cm"
                        placeholder="Ej: 15x10"
                        value={formData.tamano_cm}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">¿A Color?</label>
                <select
                    name="es_color"
                    value={formData.es_color}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                >
                    <option value="false">No, Blackwork / Sombras</option>
                    <option value="true">Sí, a Color</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de la Idea</label>
                <textarea
                    required
                    name="idea_descripcion"
                    rows={4}
                    value={formData.idea_descripcion}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    placeholder="Describe tu idea con el mayor detalle posible..."
                />
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
                </Button>
            </div>
        </form>
    );
};
