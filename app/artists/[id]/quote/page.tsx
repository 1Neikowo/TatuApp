import { QuoteForm } from '@/components/ui/QuoteForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase-server';
import { Perfil } from '@/types';

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const { data: artistData } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', id)
        .eq('rol', 'tatuador')
        .single();

    const artist = artistData as Perfil | null;

    if (!artist) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link href={`/artists/${artist.id}`} className="text-sm text-gray-500 hover:text-gray-900">
                        ← Volver al perfil de {artist.nombre_completo}
                    </Link>
                </div>

                <QuoteForm artist={artist} />
            </div>
        </div>
    );
}
