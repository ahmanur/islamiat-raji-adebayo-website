import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gwylwhtlcwwvvynnmxfu.supabase.co";
const BUCKET = "cms-media";
const supabaseServiceKey = defineSecret("SUPABASE_SERVICE_ROLE_KEY");

export const upload = onRequest(
  { cors: true, memory: "256MiB", timeoutSeconds: 60, secrets: [supabaseServiceKey] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const { name, type, data } = req.body as {
      name?: string;
      type?: string;
      data?: string;
    };

    if (!name || !type || !data) {
      res.status(400).json({ error: "Missing name, type, or data" });
      return;
    }

    const serviceKey = supabaseServiceKey.value();
    const supabase = createClient(SUPABASE_URL, serviceKey);
    const buffer = Buffer.from(data, "base64");
    const filePath = `${Date.now()}-${name.replace(/\s+/g, "-")}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, { contentType: type, upsert: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    res.json({ url: urlData.publicUrl });
  }
);
