'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { Perfil } from '@/types';

export default function EditarPerfilPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [perfil, setPerfil] = useState<Partial<Perfil>>({
        nombre_completo: '',
        bio: '',
        telefono: '',
        instagram: '',
        estilos: [],
        foto_url: '',
    });
    const [nuevoEstilo, setNuevoEstilo] = useState('');

    useEffect(() => {
        const loadPerfil = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            const { data } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setPerfil(data);
            }
            setIsLoading(false);
        };

        loadPerfil();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerfil(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const addEstilo = () => {
        if (nuevoEstilo.trim() && !perfil.estilos?.includes(nuevoEstilo.trim())) {
            setPerfil(prev => ({
                ...prev,
                estilos: [...(prev.estilos || []), nuevoEstilo.trim()],
            }));
            setNuevoEstilo('');
        }
    };

    const removeEstilo = (style: string) => {
        setPerfil(prev => ({
            ...prev,
            estilos: (prev.estilos || []).filter(s => s !== style),
        }));
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `avatars/${user.id}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('imagenes')
            .upload(fileName, file);

        if (uploadError) {
            alert('Error subiendo la foto: ' + uploadError.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('imagenes')
            .getPublicUrl(fileName);

        setPerfil(prev => ({ ...prev, foto_url: publicUrl }));
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const newUrls: string[] = [];

        for (const file of Array.from(files)) {
            const fileExt = file.name.split('.').pop();
            const fileName = `gallery/${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('imagenes')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Error uploading:', uploadError);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('imagenes')
                .getPublicUrl(fileName);

            newUrls.push(publicUrl);
        }

        setPerfil(prev => ({
            ...prev,
            galeria_urls: [...(prev.galeria_urls || []), ...newUrls],
        }));
    };

    const removeGalleryImage = (url: string) => {
        setPerfil(prev => ({
            ...prev,
            galeria_urls: (prev.galeria_urls || []).filter(u => u !== url),
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('perfiles')
                .update({
                    nombre_completo: perfil.nombre_completo,
                    bio: perfil.bio,
                    telefono: perfil.telefono,
                    instagram: perfil.instagram,
                    estilos: perfil.estilos,
                    foto_url: perfil.foto_url,
                    galeria_urls: perfil.galeria_urls,
                })
                .eq('id', user.id);

            if (error) throw error;

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error:', error);
            alert('Error guardando el perfil. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-500">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-8 text-3xl font-bold dark:text-white">Editar Mi Perfil</h1>

                <div className="space-y-8 rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800">
                    {/* Foto de perfil */}
                    <div>
                        <label className="mb-2 block text-sm font-medium dark:text-gray-300">Foto de Perfil</label>
                        <div className="flex items-center gap-4">
                            {perfil.foto_url ? (
                                <img
                                    src={perfil.foto_url}
                                    alt="Foto de perfil"
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl">
                                    ✏️
                                </div>
                            )}
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-300">Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={perfil.nombre_completo || ''}
                            onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-300">Biografía</label>
                        <textarea
                            name="bio"
                            rows={3}
                            value={perfil.bio || ''}
                            onChange={handleChange}
                            placeholder="Cuéntale a tus clientes sobre ti y tu trabajo..."
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-300">Instagram (sin @)</label>
                        <input
                            type="text"
                            name="instagram"
                            value={perfil.instagram || ''}
                            onChange={handleChange}
                            placeholder="tu.usuario"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-300">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={perfil.telefono || ''}
                            onChange={handleChange}
                            placeholder="+56912345678"
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Estilos */}
                    <div>
                        <label className="mb-1 block text-sm font-medium dark:text-gray-300">Estilos de Tatuaje</label>
                        <div className="mb-2 flex flex-wrap gap-2">
                            {perfil.estilos?.map((style) => (
                                <span
                                    key={style}
                                    className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
                                >
                                    {style}
                                    <button
                                        type="button"
                                        onClick={() => removeEstilo(style)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nuevoEstilo}
                                onChange={(e) => setNuevoEstilo(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEstilo())}
                                placeholder="Ej: Blackwork, Realismo..."
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <Button type="button" onClick={addEstilo} variant="outline" size="sm">
                                Agregar
                            </Button>
                        </div>
                    </div>

                    {/* Galería */}
                    <div>
                        <label className="mb-2 block text-sm font-medium dark:text-gray-300">Galería de Trabajos</label>
                        {perfil.galeria_urls && perfil.galeria_urls.length > 0 && (
                            <div className="mb-4 grid grid-cols-3 gap-3">
                                {perfil.galeria_urls.map((url, i) => (
                                    <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                                        <img src={url} alt={`Trabajo ${i + 1}`} className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(url)}
                                            className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryUpload}
                            className="text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium hover:file:opacity-80"
                        />
                        <p className="mt-1 text-xs text-gray-400">Puedes seleccionar varias fotos a la vez</p>
                    </div>

                    {/* Save */}
                    <div className="flex items-center gap-4 border-t pt-6 dark:border-gray-800">
                        <Button onClick={handleSave} disabled={isSaving} size="lg">
                            {isSaving ? 'Guardando...' : 'Guardar Perfil'}
                        </Button>
                        {saved && (
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                ✅ Perfil guardado
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
