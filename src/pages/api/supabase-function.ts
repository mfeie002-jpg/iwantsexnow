import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { function: functionName, payload } = req.body;

  if (!functionName) {
    return res.status(400).json({ error: "Function name is required" });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration missing");
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/${functionName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload || {}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Function call failed");
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Supabase function error:", error);
    return res.status(500).json({ error: error.message });
  }
}