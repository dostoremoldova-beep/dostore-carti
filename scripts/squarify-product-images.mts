// Curăță și normalizează imaginile de produs.
//
// Problemă găsită: sursele (706x1000) au spațiu alb „copt" în fișier — de-asta
// pe pagina produsului apărea un bloc alb mare sub imagine, indiferent de
// containerul CSS. Aici tăiem marginile uniforme (trim), apoi reîncadrăm.
//
// Rulare:
//   npx tsx scripts/squarify-product-images.mts          → doar trim (raport natural)
//   npx tsx scripts/squarify-product-images.mts --square → trim + pânză pătrată 1:1
//
// La --square fundalul pătratului e chiar imaginea, scalată să acopere și
// blurată: coperta se vede întreagă, fără benzi albe și fără deformare.
// Idempotent: rulările repetate nu strică nimic.

import sharp from "sharp";
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/products";
const SQUARE = process.argv.includes("--square");
const SIZE = 1100;
const INNER = 0.94;

let processed = 0;
let beforeTotal = 0;
let afterTotal = 0;

for (const file of readdirSync(DIR)) {
  if (!/\.(webp|jpg|jpeg|png)$/i.test(file)) continue;

  const path = join(DIR, file);
  const sizeBefore = statSync(path).size;
  // Citim noi fișierul: dacă lăsăm sharp să deschidă calea, păstrează un handle
  // și pe Windows scrierea ulterioară peste același fișier eșuează.
  const input = readFileSync(path);
  const metaBefore = await sharp(input).metadata();

  // `trim` taie marginile de culoare uniformă (albul din jurul produsului).
  // Pragul mic evită să mănânce din desen dacă coperta e deschisă la culoare.
  const trimmed = await sharp(input).trim({ threshold: 12 }).toBuffer();
  const metaTrimmed = await sharp(trimmed).metadata();

  let output: Buffer;

  if (SQUARE) {
    const background = await sharp(trimmed)
      .resize(SIZE, SIZE, { fit: "cover" })
      .blur(45)
      .modulate({ brightness: 1.05, saturation: 0.8 })
      .toBuffer();

    const inner = Math.round(SIZE * INNER);
    const foreground = await sharp(trimmed)
      .resize(inner, inner, { fit: "inside" })
      .toBuffer();

    output = await sharp(background)
      .composite([{ input: foreground, gravity: "center" }])
      .webp({ quality: 82 })
      .toBuffer();
  } else {
    output = await sharp(trimmed)
      .resize(900, 1400, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  }

  // Scriem bufferul direct: sharp nu poate scrie peste fișierul pe care-l ține deschis.
  writeFileSync(path, output);

  const sizeAfter = statSync(path).size;
  const metaAfter = await sharp(output).metadata();
  beforeTotal += sizeBefore;
  afterTotal += sizeAfter;
  processed++;

  console.log(
    `  ✓ ${file.padEnd(44)} ${metaBefore.width}x${metaBefore.height}` +
      ` → trim ${metaTrimmed.width}x${metaTrimmed.height}` +
      ` → ${metaAfter.width}x${metaAfter.height}  ` +
      `${(sizeBefore / 1024).toFixed(0)}KB → ${(sizeAfter / 1024).toFixed(0)}KB`
  );
}

console.log(
  `\n${processed} imagini procesate (${SQUARE ? "pătrat 1:1" : "raport natural"}). ` +
    `Total ${(beforeTotal / 1024).toFixed(0)}KB → ${(afterTotal / 1024).toFixed(0)}KB.`
);
