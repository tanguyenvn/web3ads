import { sql } from "@vercel/postgres";

// Biconomy paymaster webhook
export async function POST(request: Request) {
	const data = await request.json() as unknown as { userOp: { sender: string; callData: string; }};
    // call the paymaster
	const { sender } = data.userOp;

    console.log("sender: ", data.userOp);

    // check if the sender viewed any ads
    const { rows } = await sql`
        SELECT * FROM ad_views WHERE from_address = ${sender} AND viewed = true AND sponsored = false
    `;
    // if it exists, return true
    if (rows.length > 0) {
        // mark the ad as sponsored
        await sql`
            UPDATE ad_views SET sponsored = true WHERE from_address = ${sender} AND viewed = true AND sponsored = false
        `;
        return Response.json({ arePoliciesVerified: true });
    }
    return Response.json({ arePoliciesVerified: false });
}