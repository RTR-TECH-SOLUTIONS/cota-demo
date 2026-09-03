# Cotă — magazin demo de cafea de specialitate

Demo de prezentare pentru un client care vinde cafea boabe în pungi de 250 g.
Brandul „Cotă" (prăjitorie din Brașov, din 2019) e inventat — se schimbă în câteva minute
când vine numele real. „Cotă" = altitudinea de pe hartă, adică exact metrica-cheie de pe
eticheta unei cafele de specialitate. Marca e o curbă de nivel.

**Live:** https://rtr-tech-solutions.github.io/cota-demo/

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && npm run preview
```

## Deploy

Push pe `main` → GitHub Actions build → GitHub Pages
(`.github/workflows/deploy.yml`). Nu e nimic de făcut manual.

Site-ul stă într-un **subdirector** (`/cota-demo/`), nu în rădăcina domeniului.
Astro prefixează singur asset-urile prin `base` din `astro.config.mjs`, dar **nu**
și `href`-urile scrise de mână — alea trec prin `src/lib/cale.ts`. Dacă adaugi un
link intern, scrie-l `href={cale('/ruta')}`, altfel dă 404 pe Pages și merge doar
în local. Verificarea: în build, niciun `href="/…"` nu trebuie să existe fără
prefixul `/cota-demo`.

La proiectul real, cu domeniu propriu, se scot `base` din config și helperul
devine identitate — nu trebuie atinsă nicio pagină.

## De unde vine structura

**Structura de magazin** vine din [magazincafea.ro](https://www.magazincafea.ro/) — referința
dată de Mario. Am luat mecanicile lui de comerț, nu aspectul:

| Preluat | Unde e |
|---|---|
| Bară de căutare proeminentă în header, cu sugestii live | `Cauta.tsx` |
| Rând doi de navigare pe categorii, cu panou pe hover | `Header.astro` |
| Bandă de încredere cu 4 puncte sub hero | `BaraIncredere.astro` |
| „Adaugă în coș" direct pe cardul de produs + starea stocului | `CardCafea.tsx` |
| Grilă densă de produse, 2 / 3 / 4 pe rând | `componente.css` |
| Secțiune de întrebări frecvente | `Intrebari.astro` |
| Categorii ca dale cu fotografie, plus în bara de navigare | `index.astro` |
| Reduceri: badge cu procent, preț tăiat, pagină dedicată | `promotii.astro`, `CardCafea.tsx` |
| Pachete și accesorii, cu pagini proprii de listare | `pachete.astro`, `accesorii.astro` |
| Bandă de newsletter + footer pe coloane, cu metode de plată | `Newsletter.astro`, `Footer.astro` |

A doua referință, [tiravis-demo](https://rtr-tech-solutions.github.io/tiravis-demo/), a dat energia
comercială — fără secțiunea de parteneri și fără branduri:

| Preluat | Unde e |
|---|---|
| Card de ofertă chiar în hero: reducere, preț tăiat, buton | `index.astro` |
| Bandă de oferte sub hero, cu numărul de produse și economia totală | `index.astro` |
| Evidențiere plină de culoare în bara de navigare | `Header.astro` |
| Sidebar de filtre cu bifă și **numărătoare live** per opțiune | `CatalogCafele.tsx` |
| Chip-uri cu filtrele active, care se scot una câte una | `CatalogCafele.tsx` |
| Punct de stoc și „Economisești X lei" pe card | `CardCafea.tsx` |
| Banner de campanie cu ștampila de reducere | `BannerReduceri.astro` |

**Nu** am preluat: galbenul și roșul de template, stelele de rating pe fiecare card,
banner-ul promo desenat. Badge-ul de reducere e singurul element colorat din tot site-ul.

**Reducerile au motiv scris.** Nu umflăm prețul ca să-l tăiem după: fiecare produs redus are
o linie care spune de ce (lot pe terminate, iese din catalog, preț mai bun la pachet), afișată
și pe pagina de produs și în lista din `/promotii`. Asta e diferența dintre „ofertă" și
„promo-heavy", celălalt semn de template.

**Limbajul vizual** vine din prăjitoriile RO de specialitate — capturile sunt în `../_research/`:

| Referință | Ce am luat |
|---|---|
| [Origo](https://origocoffee.ro/) | Packshot pe fundal întunecat, cu bandă de etichetă colorată per origine. Ăsta e miezul. |
| [Dropshot](https://dropshot.coffee/) | Baza: fundal crem cald, butoane negre dreptunghiulare |
| [20 Grams](https://20gr.coffee/) | Banda cu data prăjirii; navigarea pe **profil de gust**, nu pe categorie |
| [Guava](https://guava.coffee/) | Hero foto pe toată lățimea, cu titlu alb peste |

**Ideea proprie, anti-AI:** limbajul de obiect real al unui prăjitor e *fișa de cupping* și
*eticheta de pe pungă*. Rânduri `Nume ....... valoare` cu leader punctat, cu cotă, varietate,
proces, scor SCA și dată de prăjire — și pe site, **și tipărite pe pungă**. Rândurile au rămas,
fontul monospace nu.

## Pozele: generate cu Higgsfield, nu stock

Toate fotografiile sunt generate cu `nano_banana_pro` prin MCP-ul Higgsfield (≈2 credite
bucata) și au același tratament: low-key, un singur izvor de lumină caldă, fără oameni cu
fața la cameră, fără stock zâmbitor.

**Packshot-urile sunt hibride și asta e partea interesantă.** O singură pungă fotografiată
o dată, cu **eticheta de hârtie goală**, apoi eticheta fiecărui lot **compusă programatic**
peste ea, cu fontul real al site-ului (Inter):

- diacriticele ies corecte de fiecare dată, ceea ce un model de imagine nu garantează;
- tipografia de pe pungă e literal aceeași cu cea din pagină;
- cele 10 pungi sunt identice, doar eticheta diferă — exact ce face o prăjitorie care
  comandă un singur ambalaj;
- eticheta se recompune din `src/data/cafele.ts`, deci un lot nou = o rulare de script.

Compunerea se face cu blending *multiply*, ca textura hârtiei și gradientul de lumină din
fotografie să treacă prin cerneală. Scriptul (`label.py` + `render.py`) a rămas în
scratchpad-ul sesiunii; dacă îl vrem în repo pentru proiectul real, îl mut în `tools/`.

Aceeași metodă e folosită și pe fotografia de lifestyle de la abonament — eticheta e așezată
acolo pe un patrulater, cu transformare de perspectivă.

## Ce e construit

**Pagini** (21 rute generate)

- `/` — hero, bandă de încredere, 6 categorii ca dale foto, 8 produse cu adăugare în coș,
  reduceri, profiluri de gust, pachete, abonament, bandă prăjitorie, rețete, recenzii,
  întrebări, newsletter
- `/cafea` — catalog cu filtre reale, sortare și filtre în URL
- `/promotii` — tot ce e la reducere, cu motivul fiecărei reduceri scris
- `/pachete` — pachet degustare, pachet espresso 2 kg, cutie cadou
- `/accesorii` — râșniță, set filtru V60, cafetieră moka, cântar
- `/cafea/[slug]` — 10 pagini de produs cu fișa completă a lotului
- `/abonament` — configurator + cum funcționează + întrebări
- `/prajitoria` — procesul în 5 etape, fișa prăjitoriei, galerie
- `/ghid` — 4 rețete, tabel de măcinare, păstrare
- `/cos`, `/finalizare` — coș și checkout
- `/contact` — NAP, program, en-gros, hartă OpenStreetMap reală

**Funcționalități care chiar merg**

- Căutare cu sugestii live (origine, notă de gust, proces, producător), cu tastatură și
  thumbnail de produs
- Panou de categorii pe hover, pe trei axe (gust / metodă / altfel)
- Reduceri reale în modelul de date (`pretVechi` + `motivReducere`), cu badge de procent,
  preț tăiat pe card și pe pagina de produs, și o pagină care le adună
- Pachete și accesorii cu selector de cantitate, care intră în același coș
- Adăugare în coș direct din card, cu confirmare și `role="status"`
- Filtrare pe profil / prăjire / proces + sortare, cu filtrele reflectate în URL
- Coș complet: 250 g / 1 kg × 5 măcinări, cantități, prag de livrare gratuită la 150 lei
- Checkout cu validare RO (telefon `07xxxxxxxx`, e-mail), curier / ridicare, card / ramburs
- Configurator de abonament care ajunge în același coș
- Meniu mobil cu căutare, newsletter cu validare

## Grile pe telefon

Toate grilele de produse stau **două pe rând pe telefon**, trei pe tabletă, patru pe desktop
(trei în catalog, unde sidebar-ul îngustează coloana). Un card pe toată lățimea umple ecranul
cu un singur produs și face magazinul să pară gol — verificat până la 360 px.

## Filtrele din catalog

Sidebar sticky cu șase axe: profil de gust, prăjită pentru, proces la fermă, preț, cota fermei
și „doar produsele la reducere". Fiecare opțiune are **numărătoarea ei, calculată live**: câte
cafele ar rămâne dacă o bifezi, cu celelalte filtre deja aplicate. Opțiunile care ar da zero
rezultate se dezactivează, nu dispar — așa vezi de ce nu merge combinația.

Deasupra rezultatelor: numărul de produse, sortarea (inclusiv „reducerea cea mai mare") și
chip-urile cu filtrele active, fiecare cu × propriu. Filtrele se reflectă în URL, deci pagina
filtrată se poate trimite mai departe. Pe telefon, panoul se deschide dintr-un buton „Filtre"
care arată câte sunt active.

## Tipografie — o singură familie

**Inter, pe tot site-ul.** Ierarhia vine din greutate și mărime, nu din schimbarea fontului:
titluri 650, prețuri 650, etichete mici uppercase 600 cu `letter-spacing: 0.075em`.

Versiunile anterioare foloseau Newsreader (serifă pe titluri) + IBM Plex Mono (etichete) +
Instrument Sans (corp). Combinația a fost respinsă: citea ca revistă, nu ca magazin.
**Newsreader și monospace-ul pe etichete sunt interzise** de aici înainte — regula e scrisă în
`~/.claude/skills/design-refs/anti-ai-tells.md` și în memoria proiectului. Pachetele au fost
scoase din `package.json`, iar etichetele tipărite pe packshot-uri au fost **regenerate cu
Inter**, ca fontul interzis să nu rămână în poze.

## Stack

Astro 7 (static) · React 19 doar în insule · Tailwind 4 + CSS vanilla cu tokeni · Inter
self-hosted prin Fontsource.

## Paleta

Culorile sunt luate din materialul propriu-zis, nu dintr-un generator:

| Token | Valoare | Ce e |
|---|---|---|
| `--color-paper` | `#faf6f0` | spumă de lapte, fundalul paginii |
| `--color-paper-deep` | `#f0e6d8` | secțiunile alternate |
| `--color-crema` | `#e6d3b8` | crema, doar suprafețe și text pe fundal închis |
| `--color-ink` | `#241a13` | boabă prăjită, atât de închisă încât citește ca negru cald |
| `--color-accent` | `#9c5424` | aramă de prăjire: preț redus, badge, evidențierea din meniu |
| `--color-stoc` | `#3d6b46` | punctul de „în stoc" |

Accentul e folosit contabil: preț redus, badge de reducere, pastila din meniu, banda de oferte.
Nicăieri altundeva. Culorile de pe etichetele pungilor sunt un sistem de codare a originii.

Contrastul a fost calculat, nu ochit: **cea mai slabă pereche e 4,59:1**, deci tot ce e scris
trece AA. Alb pe accent (badge-ul de reducere) e 5,66:1.

Insulele React nu pot folosi `<Image>` din `astro:assets`, așa că variantele optimizate de
packshot se pregătesc în `src/lib/pungi.ts` cu `getImage()` și se trimit ca props.

**Atenție la hidratare:** `CardCafea` și `CardProdus` au buton de adăugare în coș, deci au
nevoie de o directivă `client:*` **oriunde sunt folosite direct într-o pagină `.astro`** —
altfel se randează ca HTML static și butonul nu face nimic. În catalog erau deja hidratate
(sunt copii ai insulei `CatalogCafele`), dar pe homepage, `/promotii` și pagina de produs nu
erau. Toate au acum `client:visible`. Verificarea din `npm run build`: fiecare pagină care
conține `class="card-buton"` trebuie să conțină și `<astro-island>`.

## Ce e mock — caută `TODO(real):`

| Loc | Ce e fals acum |
|---|---|
| `src/data/cafele.ts`, `src/data/altele.ts` | Catalogul, pachetele și accesoriile sunt hardcodate |
| `src/lib/cos.ts` | Coșul trăiește în `localStorage` |
| `src/components/Finalizare.tsx` | Comanda generează un număr și golește coșul; nu pleacă nimic nicăieri |
| `src/components/Abonament.tsx` | Abonamentul intră în coș ca produs simplu, nu ca plată recurentă |
| `src/components/Newsletter.astro` | Înscrierea validează și afișează un mesaj |
| `src/pages/contact.astro` | Telefon și e-mailuri de umplutură |
| Data prăjirii de pe etichete | E compusă în imagine (`01.09.26`); la proiectul real se regenerează la fiecare lot |

## Dacă clientul acceptă — ce urmează

1. **Date reale**: numele brandului, cafelele reale cu fișele lor. Ambalajul clientului
   înlocuiește packshot-ul; scriptul de etichete rămâne valabil.
2. **Backend**: catalog + comenzi. Recomandarea mea e Medusa self-hostat pe VPS + Coolify,
   cu Astro trecut pe **SSR/hybrid** (pagini de marketing statice, catalog/produs/coș SSR) —
   altfel fiecare produs adăugat cere rebuild. Trecerea e config + sursă de date, nu
   rescriere: datele sunt deja izolate într-un singur modul.
3. **Plăți**: Stripe Checkout (PCI minim) + o soluție locală, Netopia sau EuPlătesc.
   Facturare automată (SmartBill/Oblio) doar dacă o cere clientul — e add-on plătit.
4. **Livrare**: integrare curier pentru AWB; e-mail tranzacțional prin Resend.
5. **SEO** (nefăcut intenționat la preview): research de keyworduri RO pe nișă + oraș,
   un keyword principal per pagină, JSON-LD `Product`, `FAQPage` și `LocalBusiness`,
   sitemap, robots.
6. **Pachet legal**: banner cookie/GDPR, Termeni, Confidențialitate, Politica de cookies,
   badge ANPC + SOL, credit „made by RTR" în footer.
7. **Performanță**: React ocupă ~180 KB din JS-ul livrat. Dacă vrem ultimele puncte de
   PageSpeed, căutarea, filtrele și coșul se pot rescrie în vanilla, iar bundle-ul scade
   sub 25 KB.
