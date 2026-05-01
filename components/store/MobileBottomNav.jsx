"use client";

import { useCart } from "react-use-cart";
import { IoHomeOutline, IoSearchOutline, IoBagHandleOutline, IoGridOutline } from "react-icons/io5";
import Link from "next/link";
import { useStore } from "@context/StoreContext";

const MobileBottomNav = ({ onSearchFocus }) => {
  const { totalItems } = useCart();
  const { storeSlug } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14 max-w-screen-lg mx-auto">
        {/* Home */}
        <Link
          href={`/${storeSlug}`}
          className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-emerald-500 transition-colors"
        >
          <IoHomeOutline className="w-5 h-5" />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>

        {/* Search */}
        <button
          onClick={onSearchFocus}
          className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-emerald-500 transition-colors"
        >
          <IoSearchOutline className="w-5 h-5" />
          <span className="text-[10px] font-medium">بحث</span>
        </button>

        {/* Cart */}
        <Link
          href={`/${storeSlug}/checkout`}
          className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-emerald-500 transition-colors relative"
        >
          <div className="relative">
            <IoBagHandleOutline className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">السلة</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
