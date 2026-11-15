import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

const ROUTES = ["/", "/free-course", "/community", "/mentorship", "/games", "/about", "/workshops", "/jobs", "/ai-and-games", "/interest", "/privacy", "/cookies", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${site.url}${r === "/" ? "/" : `${r}/`}`,
    lastModified: now,
    changeFrequency: r === "/" ? "weekly" : "monthly",
    priority: r === "/" ? 1 : r === "/community" || r === "/free-course" || r === "/mentorship" ? 0.9 : 0.6,
  }));
}
