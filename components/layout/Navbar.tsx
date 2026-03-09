import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ModeToggle } from '@/components/mode-toggle';
import { createServerSupabase } from '@/lib/supabase-server';
import SignOutButton from './SignOutButton';
import MobileNav from './MobileNav';

export const Navbar = async () => {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // Get user profile to check role
    let perfil = null;
    if (user) {
        const { data } = await supabase
            .from('perfiles')
            .select('rol, nombre_completo')
            .eq('id', user.id)
            .single();
        perfil = data;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight dark:text-white">TATUAPP</span>
                </Link>

                {/* Desktop Nav - hidden on mobile */}
                <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                    <Link href="/" className="transition-colors hover:text-gray-900/80 text-gray-900 dark:text-white dark:hover:text-gray-200">
                        Explorar
                    </Link>
                    {user && perfil?.rol === 'tatuador' && (
                        <Link href="/dashboard" className="transition-colors hover:text-gray-900/80 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
                            Mi Panel
                        </Link>
                    )}
                    {user && perfil?.rol === 'cliente' && (
                        <Link href="/mis-cotizaciones" className="transition-colors hover:text-gray-900/80 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
                            Mis Cotizaciones
                        </Link>
                    )}
                    {!user && (
                        <Link href="/login" className="transition-colors hover:text-gray-900/80 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
                            Soy Tatuador
                        </Link>
                    )}
                </nav>

                {/* Desktop Actions - hidden on mobile */}
                <div className="hidden items-center gap-4 md:flex">
                    <ModeToggle />
                    {user ? (
                        <SignOutButton />
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile: Theme toggle + Hamburger */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <MobileNav isLoggedIn={!!user} rol={perfil?.rol || null} />
                </div>
            </div>
        </header>
    );
};
