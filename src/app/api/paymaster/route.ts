import { sql } from "@vercel/postgres";
import { hashMessage } from "viem/utils";

// Biconomy paymaster webhook
export async function POST(request: Request) {
	const data = await request.json() as unknown as { userOp: { sender: string; callData: string; }};
    // call the paymaster
	const { sender, callData } = data.userOp;

    // generate tx hash from sender address and callData
    const txHash = hashMessage(JSON.stringify({ sender, callData }));

    // check if the tx_hash exists in DB
    const { rows } = await sql`
        SELECT * FROM ad_views WHERE tx_hash = ${txHash} and viewed = true
    `;
    // if it exists, return true
    if (rows.length > 0) {
        return Response.json({ arePoliciesVerified: true });
    }
    return Response.json({ arePoliciesVerified: false });
}