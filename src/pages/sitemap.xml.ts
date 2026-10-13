import type { APIRoute } from 'astro';
const pages = ['', 'research/', 'projects/', 'cv/', 'contact/'];
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = pages.flatMap((path) => [
    `<url><loc>${new URL(`${base}/${path}`, site)}</loc><xhtml:link rel="alternate" hreflang="es" href="${new URL(`${base}/es/${path}`, site)}" /></url>`,
    `<url><loc>${new URL(`${base}/es/${path}`, site)}</loc><xhtml:link rel="alternate" hreflang="en" href="${new URL(`${base}/${path}`, site)}" /></url>`,
  ]).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
