import { sql } from '@vercel/postgres';

// get the ads
export async function GET(
    request: Request
) {
    try {
        const { searchParams } = new URL(request.url);
        const tx_hash = searchParams.get('tx_hash');
        const chain_id = searchParams.get('chain_id');

        if (!tx_hash || !chain_id) {
            return Response.json({ success: false, error: 'Missing tx_hash or chain_id' }, { status: 400 });
        }

        // get the ad
        const { rows } = await sql`
            SELECT * FROM ads WHERE chain_id = ${chain_id} LIMIT 1
        `;
        if (rows.length === 0) {
            return Response.json(
                { success: false, error: 'Ad for chain not found' },
                { status: 404 }
            );
        }
        
        // create ad_views record
        await sql`
            INSERT INTO ad_views (tx_hash, ad_id, created_at)
            VALUES (${tx_hash}, ${rows[0].id}, NOW())
            RETURNING *
        `;

        return Response.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Failed to fetch ad:', error);
        return Response.json(
            { success: false, error: 'Failed to fetch ad' },
            { status: 500 }
        );
    }
}

// mark the ad as viewed
export async function POST(request: Request) {
    const { tx_hash } = await request.json();

    // check if the ad exists
    const { rows } = await sql`
        SELECT * FROM ad_views WHERE tx_hash = ${tx_hash}
    `;
    if (rows.length === 0) {
        return Response.json({ success: false, error: 'Ad not found' }, { status: 404 });
    }
    // check if the ad has already been viewed
    if (rows[0].viewed) {
        return Response.json({ success: false, error: 'Ad already viewed' }, { status: 400 });
    }

    // mark the ad as viewed
    const { rows: updatedRows } = await sql`
        UPDATE ad_views SET viewed = true WHERE tx_hash = ${tx_hash}
    `;

    return Response.json({ success: true, data: updatedRows[0] });
}

// curl -X POST http://localhost:3000/api/ad -H "Content-Type: application/json" -d '{"tx_hash": "asdfsdfsd"}'
// get ads
// curl -X GET http://localhost:3000/api/ad?id=1