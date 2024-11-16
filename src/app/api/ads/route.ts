import { AdRequest } from '@/app/utils/interface';
import { sql } from '@vercel/postgres';

export async function GET() {
    try {
        const { rows } = await sql`
            SELECT * FROM ads ORDER BY created_at DESC
        `;
        return Response.json(rows);
    } catch (error) {
        console.error('Failed to fetch ads:', error);
        return Response.json(
            { success: false, error: 'Failed to fetch ads' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { chain_id: chainId, type, url, cost_per_ad: costPerAd, owner } = body as AdRequest;
        console.log(chainId, type, url, costPerAd, owner);
        
        const { rows } = await sql`
            INSERT INTO ads (owner, chain_id, type, url, cost_per_ad, created_at)
            VALUES (${owner}, ${chainId}, ${type}, ${url}, ${costPerAd}, NOW())
            RETURNING *
        `;

        return Response.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Failed to create ad:', error);
        return Response.json(
            { success: false, error: 'Failed to create ad' },
            { status: 500 }
        );
    }
}