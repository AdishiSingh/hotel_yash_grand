import { MetadataRoute } from "next";

/**
 * Dynamic Robots Indexing Policy
 * Disallows indexing of admin panels and point-of-sale captain systems.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hotelyashgrand.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/bookings",
        "/billing",
        "/pos-control",
        "/pos"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
