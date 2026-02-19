'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Artist } from '@/types';
import { createClient } from '@/lib/supabase';

interface QuoteFormProps {
    artist: Artist;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ artist }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        body_part: '',
        size_cm: '',
        is_color: 'false',
        ideas_desc: '',
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
            const { error } = await supabase.from('quotes').insert({
                artist_id: artist.id,
                client_name: formData.client_name,
                client_email: formData.client_email,
                body_part: formData.body_part,
                size_cm: formData.size_cm,
                is_color: formData.is_color === 'true',
                ideas_desc: formData.ideas_desc,
                status: 'pending',
                // reference_images: [] // TODO: Implement file upload later
            });

            if (error) throw error;

            console.log('Form submitted:', formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Hubo un error al enviar la cotización. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="rounded-lg border bg-green-50 p-8 text-center text-green-900 dark:bg-green-900/30 dark:text-green-200 dark:border-green-900">
                <h3 className="mb-2 text-2xl font-bold">¡Solicitud Enviada!</h3>
                <p>Tu cotización ha sido enviada a {artist.name}. Te contactará pronto al email proporcionado.</p>
                <Button
                    className="mt-6"
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                >
                    Volver al inicio
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <h2 className="mb-6 text-xl font-bold dark:text-white">Cotizar con {artist.name}</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                    <input
                        required
                        type="text"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        required
                        type="email"
                        name="client_email"
                        value={formData.client_email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Zona del Cuerpo</label>
                    <input
                        required
                        type="text"
                        name="body_part"
                        placeholder="Ej: Antebrazo, Espalda..."
                        value={formData.body_part}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño Aproximado (cm)</label>
                    <input
                        required
                        type="text"
                        name="size_cm"
                        placeholder="Ej: 15x10"
                        value={formData.size_cm}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">¿A Color?</label>
                <select
                    name="is_color"
                    value={formData.is_color}
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
                    name="ideas_desc"
                    rows={4}
                    value={formData.ideas_desc}
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
