"use client";

import { AdminProvider } from "@/app/AdminProvider";
import { CatalogCard } from "@/src/components/CardCatalog/CardCatalog";
import { FromCatalog } from "@/src/components/FormCatalog/FromCatalog";
import { Orders } from "@/src/components/Orders/Orders";
import { Header } from "@/src/components/header/Header";
import { CreateCatalogDto } from "@/src/store/catalog.store";
import { Tabs } from "antd";
import { useEffect, useState } from "react";


export default function Panel() {
  const [data, setData] = useState<CreateCatalogDto[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalog`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  },[]);
  return (
    <AdminProvider>
      <Header />
      <div className="m-20 md:m-25">
        <Tabs
          items={[
            {
              key: "1",
              label: "Каталог",
              children: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.map((item) => (
                    <CatalogCard key={item.id} item={item} isAdmin/>
                  ))}
                </div>
              ),
            },
            {
              key: "2",
              label: "Добавить товар",
              children: <FromCatalog />,
            },
            {
              key: "3",
              label: "Заказы",
              children: <Orders />,
            }
          ]}
        ></Tabs>
      </div>
    </AdminProvider>
  );
}
