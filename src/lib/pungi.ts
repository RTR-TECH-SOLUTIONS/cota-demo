import { getImage } from 'astro:assets';

/**
 * Packshot-urile pungilor. Sunt fotografii reale, nu desene: aceeași pungă
 * fotografiată o dată, cu eticheta de hârtie compusă peste ea pentru fiecare lot
 * — exact ce face o prăjitorie care comandă un singur ambalaj.
 *
 * Insulele React nu pot folosi <Image> din astro:assets, așa că pregătim aici
 * variantele optimizate și le trimitem mai departe ca props.
 */
const fisiere = import.meta.glob<{ default: ImageMetadata }>('../assets/pungi/*.jpg', {
  eager: true,
});

export type ImaginePunga = {
  src: string;
  srcset: string;
  latime: number;
  inaltime: number;
};

export async function imaginiPungi(latimi: number[] = [340, 680]): Promise<
  Record<string, ImaginePunga>
> {
  const rezultat: Record<string, ImaginePunga> = {};

  for (const [cale, modul] of Object.entries(fisiere)) {
    const slug = cale.split('/').pop()!.replace(/\.jpg$/, '');
    const variante = await Promise.all(
      latimi.map((w) => getImage({ src: modul.default, width: w, format: 'avif', quality: 70 })),
    );
    rezultat[slug] = {
      src: variante[0].src,
      srcset: variante.map((v, i) => `${v.src} ${latimi[i]}w`).join(', '),
      latime: latimi[0],
      inaltime: latimi[0],
    };
  }

  return rezultat;
}
