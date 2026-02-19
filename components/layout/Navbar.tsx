import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ModeToggle } from '@/components/mode-toggle';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import SignOutButton from './SignOutButton'; // New client component for sign out

export const Navbar = async () => {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tight dark:text-white">TATUAPP</span>
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-gray-900/80 text-gray-900 dark:text-white dark:hover:text-gray-200">
                        Explorar
                    </Link>
                    <Link href={user ? "/dashboard" : "/login"} className="transition-colors hover:text-gray-900/80 text-gray-500 dark:text-gray-400 dark:hover:text-gray-200">
                        Soy Tatuador
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
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
            </div>
        </header>
    );
};
