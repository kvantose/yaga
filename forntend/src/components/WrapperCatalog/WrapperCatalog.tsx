"use client";

import { useCatalogStore } from "@/src/store/catalog.store";
import { useEffect } from "react";
import { CatalogCard } from "../CardCatalog/CardCatalog";
import { Spin } from 'antd';

export const WrapperCatalog = () => {
  const { items, fetchItems, isLoading, error } = useCatalogStore();

  useEffect(() => {
    fetchItems();
  }, []);

  if (isLoading) {
    return <div className="text-center"><Spin size="large" /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Ошибка загрузки каталога: {error}</div>;
  }

  return (
    <div id="catalog">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <CatalogCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
