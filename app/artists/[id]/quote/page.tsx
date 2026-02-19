import { QuoteForm } from '@/components/ui/QuoteForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Artist } from '@/types';

// export async function generateStaticParams() { ... }

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = createClient();
    const { data: artistData } = await supabase.from('artists').select('*').eq('id', id).single();

    const artist = artistData as Artist | null;

    if (!artist) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link href={`/artists/${artist.id}`} className="text-sm text-gray-500 hover:text-gray-900">
                        ← Volver al perfil de {artist.name}
                    </Link>
                </div>

                <QuoteForm artist={artist} />
            </div>
        </div>
    );
}
