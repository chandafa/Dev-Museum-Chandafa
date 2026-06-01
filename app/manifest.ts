import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dev Museum",
    short_name: "Dev Museum",
    description: "A cinematic GitHub-powered developer museum and project archive.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0e10",
    theme_color: "#0d0e10",
    icons: [
      {
        src: "/mark.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
