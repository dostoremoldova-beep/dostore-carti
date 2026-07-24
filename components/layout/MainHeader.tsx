import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { HeaderActions } from "./HeaderActions";
import { getAllCategories } from "@/lib/categories";

// Async ca să dea categoriile către meniul mobil — pe telefon, unde
// SecondaryNav (mega-meniul) e ascuns (`hidden md:block`), categoriile
// trebuie să fie accesibile din altă parte: din meniul hamburger.
export async function MainHeader() {
  const categories = await getAllCategories();

  return (
    <div className="border-b border-border bg-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
        <MobileMenu categories={categories} />
        <Logo />
        <SearchBar />
        <HeaderActions />
      </div>
    </div>
  );
}
