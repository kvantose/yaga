import Link from "next/link";
import { HeaderBasket } from "@/src/components/OrderModal/HeaderBasket";
import { BasketBadge } from "./BasketBadge";

export const Header = () => {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 md:px-14">
      <header className="w-full flex items-center justify-between px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        <Link href="/" className="group">
          <h1 className="text-lg font-medium tracking-[0.2em] uppercase text-textPrimary transition-colors group-hover:text-accent">
            YAGAart
          </h1>
        </Link>

        <nav className="flex items-center gap-8 text-sm tracking-wide text-textPrimary">
          <Link href="#about">О нас</Link>
          <Link href="#catalog">Каталог</Link>

          <div className="relative">
            <HeaderBasket />
            <BasketBadge />
          </div>
        </nav>
      </header>
    </div>
  );
};
