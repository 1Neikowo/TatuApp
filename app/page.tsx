import { ArtistCard } from '@/components/ui/ArtistCard';
import { createClient } from '@/lib/supabase';
import { Artist } from '@/types';

export const revalidate = 0; // Disable caching for now to see updates immediately

export default async function Home() {
  const supabase = createClient();
  const { data: artists } = await supabase.from('artists').select('*');

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl dark:text-white">
          Encuentra tu Tatuador Ideal
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Explora artistas locales, revisa sus estilos y cotiza tu próximo tatuaje.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artists?.map((artist) => (
          <ArtistCard key={artist.id} artist={artist as Artist} />
        ))}
        {(!artists || artists.length === 0) && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No se encontraron tatuadores registrados.
          </p>
        )}
      </section>
    </div>
  );
}
