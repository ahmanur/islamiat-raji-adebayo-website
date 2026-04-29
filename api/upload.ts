import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gwylwhtlcwwvvynnmxfu.supabase.co";
const BUCKET = "cms-media";

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const body =
    typeof req.body === "object" && req.body !== null
      ? (req.body as Record<string, string>)
      : await new Promise<Record<string, string>>((resolve, reject) => {
          let raw = "";
          req.on("data", (chunk) => (raw += chunk));
          req.on("end", () => {
            try {
              resolve(JSON.parse(raw));
            } catch {
              reject(new Error("Invalid JSON"));
            }
          });
          req.on("error", reject);
        });

  const { name, type, data } = body;

  if (!name || !type || !data) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing name, type, or data" }));
    return;
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Storage service not configured" }));
    return;
  }

  const supabase = createClient(SUPABASE_URL, serviceKey);
  const buffer = Buffer.from(data, "base64");
  const path = `${Date.now()}-${name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: type, upsert: true });

  if (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
    return;
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ url: urlData.publicUrl }));
}
