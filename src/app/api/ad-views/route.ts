import { sql } from '@vercel/postgres';

// get the ads
export async function GET(
    request: Request
) {
    try {
        const { searchParams } = new URL(request.url);
        const from_address = searchParams.get('from_address');
        const chain_id = searchParams.get('chain_id');

        if (!from_address || !chain_id) {
            return Response.json({ success: false, error: 'Missing from_address or chain_id' }, { status: 400 });
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

        // check if the ad_views record exists
        const { rows: adViewsRows } = await sql`
            SELECT * FROM ad_views WHERE from_address = ${from_address} AND ad_id = ${rows[0].id} AND viewed = false
        `;
        if (adViewsRows.length === 0) {
            // create ad_views record
            await sql`
                INSERT INTO ad_views (from_address, ad_id, created_at)
                VALUES (${from_address}, ${rows[0].id}, NOW())
                RETURNING *
            `;
        }
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
    const { chain_id, from_address } = await request.json();

    // check if the ad exists
    const { rows } = await sql`
        SELECT * FROM ad_views
        INNER JOIN ads ON ad_views.ad_id = ads.id
        WHERE ad_views.from_address = ${from_address} AND ad_views.viewed = false AND ads.chain_id = ${chain_id}
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
        UPDATE ad_views SET viewed = true WHERE from_address = ${from_address} AND viewed = false
    `;

    return Response.json({ success: true, data: updatedRows[0] });
}