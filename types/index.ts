export interface Artist {
    id: string;
    name: string;
    bio: string;
    styles: string[];
    photo_url: string;
    gallery_urls: string[];
    availability: {
        next_available: string; // e.g., "2023-11-15"
        working_days: string[]; // e.g., ["Mon", "Tue", "Thu"]
    };
}

export interface Quote {
    id: string;
    artist_id: string;
    client_name: string;
    client_email: string;
    body_part: string;
    size_cm: string;
    is_color: boolean;
    ideas_desc: string;
    reference_images: string[];
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    created_at: string;
}
