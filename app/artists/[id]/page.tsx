import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Artist } from '@/types';

// Remove static params for now as data is dynamic
// export async function generateStaticParams() { ... }

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = createClient();
    const { data: artistData } = await supabase.from('artists').select('*').eq('id', id).single();

    const artist = artistData as Artist | null;

    if (!artist) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                    ← Volver al directorio
                </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <div className="relative mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={artist.photo_url}
                                alt={artist.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h1 className="mb-2 text-center text-2xl font-bold dark:text-white">{artist.name}</h1>
                        <p className="mb-4 text-center text-gray-500 dark:text-gray-400">{artist.bio}</p>

                        <div className="mb-6 flex flex-wrap justify-center gap-2">
                            {artist.styles.map((style) => (
                                <span
                                    key={style}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    {style}
                                </span>
                            ))}
                        </div>

                        <div className="border-t pt-4 dark:border-gray-800">
                            <h3 className="mb-2 font-semibold dark:text-white">Disponibilidad</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Próxima fecha: <span className="font-medium text-gray-900 dark:text-white">{artist.availability.next_available}</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Días: {artist.availability.working_days.join(', ')}
                            </p>
                        </div>

                        <div className="mt-8">
                            <Link href={`/artists/${artist.id}/quote`}>
                                <Button className="w-full" size="lg">
                                    Cotizar Tatuaje
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Gallery */}
                <div className="lg:col-span-2">
                    <h2 className="mb-6 text-2xl font-bold">Galería de Trabajos</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {artist.gallery_urls.map((url, index) => (
                            <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                                <Image
                                    src={url}
                                    alt={`Trabajo de ${artist.name} ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
