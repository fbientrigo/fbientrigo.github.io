import type { APIRoute } from 'astro';
import { pages } from '../data/site';

// hreflang alternates live in each page <head>; the sitemap only lists URLs.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = pages
    .flatMap((path) => [`${base}/${path ? `${path}/` : ''}`, `${base}/es/${path ? `${path}/` : ''}`])
    .map((loc) => `<url><loc>${new URL(loc, site)}</loc></url>`)
    .join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
