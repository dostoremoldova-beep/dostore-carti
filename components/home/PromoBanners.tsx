import Image from "next/image";
import Link from "next/link";

const BANNERS = [
  {
    title: "Noutăți editoriale",
    description: "Cele mai proaspete apariții, în fiecare săptămână",
    cta: "Descoperă noutățile",
    href: "/carti/noutati",
    photoId: "photo-1783676167814-13057079dd43",
  },
  {
    title: "Reduceri",
    description: "Cărți alese, la prețuri mai mici pentru o vreme",
    cta: "Vezi reducerile",
    href: "/carti/reduceri",
    photoId: "photo-1622010652810-eba11f92f90f",
  },
  {
    title: "Pachet cadou",
    description: "Ambalăm cartea perfectă pentru cei dragi",
    cta: "Alege un cadou",
    href: "/colectii",
    photoId: "photo-1509024102370-fd7802f4a7a7",
  },
];

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {BANNERS.map((banner) => (
          <Link
            key={banner.title}
            href={banner.href}
            className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-xl p-5"
          >
            <Image
              src={`https://images.unsplash.com/${banner.photoId}?auto=format&fit=crop&w=800&h=600&q=80`}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/0" />
            <div className="relative">
              <h3 className="font-serif text-xl font-semibold text-cream">{banner.title}</h3>
              <p className="mt-1 text-sm text-cream/80">{banner.description}</p>
              <span className="mt-2 inline-block text-sm font-semibold text-gold">
                {banner.cta} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
