"use client";

import { useEffect, useState } from "react";

interface IOrder {
  id: string;
  phone: string;
  telegram: string;
  totalPrice: number;
  createdAt: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export const Orders = () => {
  const [data, setData] = useState<IOrder[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <table className="min-w-full bg-white rounded-2xl">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Клиент
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Товары
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Сумма
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Дата
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-mono text-gray-900">
                  #{order.id.slice(0, 6)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  <div>{order.phone}</div>
                  <div className="text-gray-500 text-xs">@{order.telegram}</div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  <div className="font-medium">{order.items.length} тов.</div>
                  <div className="text-gray-500 text-xs">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.name)
                      .join(", ")}
                    {order.items.length > 2 && "..."}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-semibold text-blue-600">
                  {order.totalPrice.toLocaleString("ru-RU")} ₽
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
