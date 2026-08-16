"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);

    try {
      const response = await fetch(`/api/ticket/${id}?mode=download`, {
        cache: "no-store"
      });

      if (!response.ok) throw new Error("Cannot create download link");

      const data = (await response.json()) as { url: string };
      window.location.assign(data.url);
    } catch {
      alert("Download link ထုတ်မရပါ။ နောက်တစ်ကြိမ် ပြန်စမ်းပါ။");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button className="secondary-action" onClick={download} disabled={loading}>
      <Download size={19} />
      {loading ? "Preparing..." : "Download"}
    </button>
  );
}
