import { ArtistCard } from '@/components/ui/ArtistCard';
import { createServerSupabase } from '@/lib/supabase-server';
import { Perfil } from '@/types';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createServerSupabase();
  const { data: tatuadores } = await supabase
    .from('perfiles')
    .select('*')
    .eq('rol', 'tatuador');

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
        {tatuadores?.map((t) => (
          <ArtistCard key={t.id} artist={t as Perfil} />
        ))}
        {(!tatuadores || tatuadores.length === 0) && (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No se encontraron tatuadores registrados.
          </p>
        )}
      </section>
    </div>
  );
}
