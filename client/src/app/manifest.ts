import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Infraly",
    short_name: "Infraly",
    description: "Developer-First Form Backend & Modern CRM",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#24bce8",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

