import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@/types';
import { Button } from './Button';

interface ArtistCardProps {
    artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
    return (
        <div className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={artist.photo_url}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{artist.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                    {artist.styles.slice(0, 3).map((style) => (
                        <span
                            key={style}
                            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                            {style}
                        </span>
                    ))}
                </div>
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
