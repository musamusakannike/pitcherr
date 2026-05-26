import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms", "/auth"],
      disallow: ["/dashboard/", "/api/"],
    },
    sitemap: "https://pitcherr.codiac.online/sitemap.xml",
  };
}
