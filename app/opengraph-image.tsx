import { ImageResponse } from "next/og";

export const alt = "Kivora. Tu web y tu app. Mismo diseño.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "70px 80px", background: "linear-gradient(125deg, #eee9ff, #f3f9fc 65%, #e9e3ff)", color: "#25262d" }}>
      <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>kivora</div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: 68, fontSize: 76, fontWeight: 700, letterSpacing: -4 }}>
        <span>Tu web y tu app.</span><span style={{ color: "#6558e8" }}>Mismo diseño.</span>
      </div>
      <div style={{ display: "flex", fontSize: 26, marginTop: 38 }}>Componentes para React y React Native</div>
    </div>, size,
  );
}
