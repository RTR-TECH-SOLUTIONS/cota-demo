import { getImage } from 'astro:assets';

/**
 * Imaginile pentru pachete și accesorii. Aceeași poveste ca la `pungi.ts`:
 * insulele React nu pot folosi <Image>, deci pregătim variantele aici.
 */
const fisiere = import.meta.glob<{ default: ImageMetadata }>('../assets/produse/*.jpg', {
  eager: true,
});

export type ImagineProdus = {
  src: string;
  srcset: string;
  latime: number;
  inaltime: number;
};

export async function imaginiProduse(
  latimi: number[] = [340, 680],
): Promise<Record<string, ImagineProdus>> {
  const rezultat: Record<string, ImagineProdus> = {};

  for (const [cale, modul] of Object.entries(fisiere)) {
    const nume = cale.split('/').pop()!.replace(/\.jpg$/, '');
    const variante = await Promise.all(
      latimi.map((w) => getImage({ src: modul.default, width: w, format: 'avif', quality: 70 })),
    );
    const raport = modul.default.height / modul.default.width;
    rezultat[nume] = {
      src: variante[0].src,
      srcset: variante.map((v, i) => `${v.src} ${latimi[i]}w`).join(', '),
      latime: latimi[0],
      inaltime: Math.round(latimi[0] * raport),
    };
  }

  return rezultat;
}
