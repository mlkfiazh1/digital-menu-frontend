import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { menuUrl } from "../lib/media";
import { Button } from "./Button";

export function QrShare({ slug, name }) {
  const [copied, setCopied] = useState(false);
  const url = menuUrl(slug);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-paper p-5">
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG value={url} size={168} bgColor="#ffffff" fgColor="#161210" />
      </div>
      <div className="text-center">
        <p className="font-display text-lg">{name}</p>
        <p className="mt-1 break-all text-xs text-muted">{url}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={copyLink} variant="secondary">
          {copied ? "Copied" : "Copy menu link"}
        </Button>
        <a href={url} target="_blank" rel="noreferrer">
          <Button variant="ghost">Open menu</Button>
        </a>
      </div>
    </div>
  );
}
