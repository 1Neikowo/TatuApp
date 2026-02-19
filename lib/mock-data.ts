import { Artist, Quote } from '@/types';

export const mockArtists: Artist[] = [
    {
        id: '1',
        name: 'Sofia Blackwork',
        bio: 'Especialista en líneas finas y blackwork. Tatuando desde 2018.',
        styles: ['Blackwork', 'Fine Line', 'Dotwork'],
        photo_url: 'https://placehold.co/400x400/202020/FFF?text=Sofia',
        gallery_urls: [
            'https://placehold.co/400x400/303030/FFF?text=Work+1',
            'https://placehold.co/400x400/303030/FFF?text=Work+2',
            'https://placehold.co/400x400/303030/FFF?text=Work+3',
        ],
        availability: {
            next_available: '2023-11-20',
            working_days: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
    },
    {
        id: '2',
        name: 'Mateo Realismo',
        bio: 'Fanático del realismo en sombras y color. Retratos y animales.',
        styles: ['Realism', 'Black & Grey', 'Color'],
        photo_url: 'https://placehold.co/400x400/202020/FFF?text=Mateo',
        gallery_urls: [
            'https://placehold.co/400x400/303030/FFF?text=Realism+1',
            'https://placehold.co/400x400/303030/FFF?text=Realism+2',
        ],
        availability: {
            next_available: '2023-12-01',
            working_days: ['Mon', 'Tue', 'Fri'],
        },
    },
    {
        id: '3',
        name: 'Lucas Tradicional',
        bio: 'Old School nunca muere. Colores sólidos y líneas gruesas.',
        styles: ['Traditional', 'Old School', 'Japanese'],
        photo_url: 'https://placehold.co/400x400/202020/FFF?text=Lucas',
        gallery_urls: [
            'https://placehold.co/400x400/303030/FFF?text=Trad+1',
            'https://placehold.co/400x400/303030/FFF?text=Trad+2',
        ],
        availability: {
            next_available: '2023-11-18',
            working_days: ['Wed', 'Thu', 'Fri', 'Sat'],
        },
    },
];

export const mockQuotes: Quote[] = [
    {
        id: '101',
        artist_id: '1',
        client_name: 'Juan Perez',
        client_email: 'juan@example.com',
        body_part: 'Antebrazo',
        size_cm: '15x10',
        is_color: false,
        ideas_desc: 'Quiero un diseño geométrico con un lobo.',
        reference_images: [],
        status: 'pending',
        created_at: '2023-11-10T10:00:00Z',
    },
    {
        id: '102',
        artist_id: '1',
        client_name: 'Maria Gomez',
        client_email: 'maria@example.com',
        body_part: 'Espalda',
        size_cm: '20x20',
        is_color: true,
        ideas_desc: 'Flores de cerezo cayendo.',
        reference_images: [],
        status: 'reviewed',
        created_at: '2023-11-09T14:30:00Z',
    },
];
