export interface Ad {
    id: number;
    owner: string;
    chain_id: string;
    type: string; // image, video
    url: string;
    cost_per_ad: number;
    created_at: string;
}

export type AdRequest = Omit<Ad, 'id' | 'created_at'>;