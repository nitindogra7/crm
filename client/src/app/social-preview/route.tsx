import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#f1f7ff", color: "#17253e", fontFamily: "sans-serif" }}><div style={{ fontSize: 40, color: "#168cac", marginBottom: 45 }}>infraly.</div><div style={{ fontSize: 72, fontWeight: 700 }}>Connect your forms.</div><div style={{ fontSize: 72, fontWeight: 700 }}>Manage your leads.</div><div style={{ marginTop: 35, fontSize: 30 }}>A form backend and a clear place for every enquiry.</div></div>, { width: 1200, height: 630 });
}

