import type { Metadata } from "next";
import { site } from "@/config/site";

/** Unique title, description, canonical and Open Graph for one route. site.url already includes any base path. */
export function pageMeta(title: string, description: string, path: string, opts?: { noindex?: boolean }): Metadata {
  const url = `${site.url}${path === "/" ? "/" : `${path}/`}`;
  const og = `${site.url}/og.png`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: og, width: 1200, height: 630, alt: "Make your game happen: learn AI by building real games" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
    robots: opts?.noindex ? { index: false, follow: true } : undefined,
  };
}
