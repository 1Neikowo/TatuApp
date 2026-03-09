import Image from 'next/image';
import Link from 'next/link';
import { Perfil } from '@/types';
import { Button } from './Button';

interface ArtistCardProps {
    artist: Perfil;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
    return (
        <div className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-muted">
                {artist.foto_url ? (
                    <Image
                        src={artist.foto_url}
                        alt={artist.nombre_completo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
                        ✏️
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{artist.nombre_completo}</h3>
                {artist.bio && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                    {artist.estilos.slice(0, 3).map((style) => (
                        <span
                            key={style}
                            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {style}
                        </span>
                    ))}
                </div>
                {artist.instagram && (
                    <p className="mt-2 text-xs text-muted-foreground">
                        @{artist.instagram}
                    </p>
                )}
                <div className="mt-4">
                    <Link href={`/artists/${artist.id}`}>
                        <Button className="w-full" variant="outline">
                            Ver Perfil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
