/**
 * Prefixează linkurile interne cu baza site-ului.
 *
 * Pe GitHub Pages, site-ul stă într-un subdirector (`/cota-demo/`), nu în
 * rădăcină. Astro rescrie singur căile din `<Image>` și din importurile de
 * asset-uri, dar NU și `href`-urile scrise de mână. Fără prefixul ăsta,
 * fiecare link intern ar duce la 404 pe Pages.
 *
 * `BASE_URL` e „/" în dezvoltare, deci în local nu schimbă nimic.
 */
const BAZA = import.meta.env.BASE_URL.replace(/\/$/, '');

export const cale = (p: string) => (p.startsWith('/') ? `${BAZA}${p}` : p);
