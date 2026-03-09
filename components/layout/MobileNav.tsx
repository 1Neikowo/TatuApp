'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface MobileNavProps {
    isLoggedIn: boolean;
    rol: string | null;
}

export default function MobileNav({ isLoggedIn, rol }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setIsOpen(false);
        router.push('/');
        router.refresh();
    };

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-muted hover:text-gray-900 dark:text-gray-300 dark:hover:text-white md:hidden"
                aria-label="Abrir menú"
            >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 top-16 z-50 md:hidden">
                    {/* Dark backdrop - click to close */}
                    <div className="absolute inset-0 bg-black/30" onClick={closeMenu} />

                    {/* Menu panel - solid bg, drops from top */}
                    <div className="relative bg-background border-b border-border shadow-lg">
                        <nav className="flex flex-col gap-1 px-4 py-4">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                🔍 Explorar
                            </Link>

                            {isLoggedIn && rol === 'tatuador' && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        📊 Mi Panel
                                    </Link>
                                    <Link
                                        href="/dashboard/perfil"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        ✏️ Editar Perfil
                                    </Link>
                                </>
                            )}

                            {isLoggedIn && rol === 'cliente' && (
                                <Link
                                    href="/mis-cotizaciones"
                                    onClick={closeMenu}
                                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    📋 Mis Cotizaciones
                                </Link>
                            )}

                            {!isLoggedIn && (
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                    ✏️ Soy Tatuador
                                </Link>
                            )}

                            {/* Divider */}
                            <div className="my-2 border-t border-border" />

                            {isLoggedIn ? (
                                <button
                                    onClick={handleSignOut}
                                    className="rounded-lg px-4 py-3 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                    🚪 Cerrar Sesión
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2 px-4 pt-2 pb-2">
                                    <Link href="/login" onClick={closeMenu}>
                                        <Button className="w-full">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                    <Link href="/register" onClick={closeMenu}>
                                        <Button variant="outline" className="w-full">
                                            Crear Cuenta
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
