import { sql } from '@vercel/postgres';

export async function GET(
    request: Request
) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        const { rows } = await sql`
            SELECT * FROM ads WHERE id = ${id}
        `;

        if (rows.length === 0) {
            return Response.json(
                { success: false, error: 'Ad not found' },
                { status: 404 }
            );
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
