import type { MetadataRoute } from "next";
import { THEME_COLOR } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Favian Zufar Niardi (Thiris) | Portfolio",
    short_name: "Thiris",
    description:
      "Portfolio of Favian Zufar Niardi (Thiris), a computer network engineering student focused on networks, servers, and web development.",
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
