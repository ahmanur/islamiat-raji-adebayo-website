import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const SUPABASE_URL = "https://gwylwhtlcwwvvynnmxfu.supabase.co";

router.post("/upload", async (req, res) => {
  const { name, type, data } = req.body as { name?: string; type?: string; data?: string };

  if (!name || !type || !data) {
    res.status(400).json({ error: "Missing name, type, or data" });
    return;
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    res.status(500).json({ error: "Storage service not configured" });
    return;
  }

  const supabase = createClient(SUPABASE_URL, serviceKey);

  const buffer = Buffer.from(data, "base64");
  const path = `${Date.now()}-${name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("cms-media")
    .upload(path, buffer, { contentType: type, upsert: true });

  if (error) {
    req.log.error({ err: error }, "Upload failed");
    res.status(500).json({ error: error.message });
    return;
  }

  const { data: urlData } = supabase.storage.from("cms-media").getPublicUrl(path);
  res.json({ url: urlData.publicUrl });
});

export default router;
