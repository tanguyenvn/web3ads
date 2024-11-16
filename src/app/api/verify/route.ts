export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch("https://developer.worldcoin.org/api/v2/verify/app_staging_984b9e010eef741ff95582c99ed6e050", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...body, action: "verify-as-human-for-gasless-transaction" }),
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorResponse = await response.text(); // Read the error response
            return Response.json({ error: errorResponse }, { status: response.status });
        }

        // Parse and return the successful response
        const data = await response.json();
        Response.json(data);
    } catch (error) {
        console.error("Error verifying proof:", error);
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
};