"use client";

import { useBasketStore } from "@/src/store/basket.store";
import { useEffect, useState, startTransition } from "react";
export const BasketBadge = () => {
  const totalCount = useBasketStore((state) => state.totalCount());
    const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
  }, []);

  if (!isClient || totalCount <= 0) {
    return null;
  }

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
      {totalCount}
    </span>
  );
};
