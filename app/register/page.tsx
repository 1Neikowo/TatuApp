'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        password: '',
        rol: 'cliente' as 'cliente' | 'tatuador',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        nombre_completo: formData.nombre_completo,
                        rol: formData.rol,
                    },
                },
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-8 dark:bg-green-900/20 dark:border-green-800">
                        <h2 className="text-2xl font-bold text-green-900 dark:text-green-200">
                            ¡Cuenta Creada!
                        </h2>
                        <p className="mt-2 text-green-700 dark:text-green-300">
                            Revisa tu email para confirmar tu cuenta. Luego podrás iniciar sesión.
                        </p>
                        <Link href="/login">
                            <Button className="mt-6" variant="outline">
                                Ir a Iniciar Sesión
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Crear Cuenta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Únete como cliente o tatuador
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Selector de Rol */}
                    <div className="flex rounded-lg border border-border overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rol: 'cliente' }))}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${formData.rol === 'cliente'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            🎨 Quiero Tatuarme
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, rol: 'tatuador' }))}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${formData.rol === 'tatuador'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background text-muted-foreground hover:bg-muted'
                                }`}
                        >
                            ✏️ Soy Tatuador
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre Completo
                            </label>
                            <input
                                id="nombre_completo"
                                name="nombre_completo"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Tu nombre"
                                value={formData.nombre_completo}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creando cuenta...' : `Registrarme como ${formData.rol === 'cliente' ? 'Cliente' : 'Tatuador'}`}
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">¿Ya tienes cuenta? </span>
                        <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
                            Iniciar Sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
