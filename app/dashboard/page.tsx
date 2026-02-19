import { Button } from '@/components/ui/Button';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Quote } from '@/types';

export default async function DashboardPage() {
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

    if (!user) {
        redirect('/login');
    }

    const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold dark:text-white">Panel del Tatuador</h1>
                <Button variant="outline">Configuración</Button>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/50 px-6 py-4">
                    <h2 className="text-lg font-medium text-card-foreground">Cotizaciones Recientes</h2>
                </div>
                <div className="divide-y divide-border">
                    {(!quotes || quotes.length === 0) ? (
                        <div className="p-6 text-center text-muted-foreground">No tienes cotizaciones pendientes.</div>
                    ) : (
                        quotes.map((quote: any) => (
                            <div key={quote.id} className="p-6 transition-colors hover:bg-muted/50">
                                <div className="flex flex-col justify-between gap-4 md:flex-row">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <h3 className="text-lg font-semibold dark:text-white">{quote.client_name}</h3>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                                }`}>
                                                {quote.status === 'pending' ? 'Pendiente' : 'Revisado'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{quote.client_email}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Zona:</span> {quote.body_part}
                                            </div>
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Tamaño:</span> {quote.size_cm}
                                            </div>
                                            <div>
                                                <span className="font-medium dark:text-gray-200">Estilo:</span> {quote.is_color ? 'Color' : 'Blackwork/Sombra'}
                                            </div>
                                        </div>
                                        <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                            <p className="italic">"{quote.ideas_desc}"</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 md:w-32">
                                        <Button size="sm">Responder</Button>
                                        <Button size="sm" variant="outline">Archivar</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
