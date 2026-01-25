"use client";

import { useBasketStore } from "@/src/store/basket.store";
import { Button, Popconfirm, Popover } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { OrderBasket } from "./OrderBasket";

export const HeaderBasket = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [moadalBasket, setModalBasket] = useState(false);
  const { basketItems, increaseItem, decreaseItem, clearBasket } =
    useBasketStore();

  const hadnleOpenModalBasket = () => {
    setModalBasket(true)
    setPopoverOpen(false)
  };
  const content = (
    <div className="flex flex-col gap-9">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold leading-tight">Ваша корзина</h2>
        <Popconfirm
          title="Вы уверены, что хотите очистить корзину?"
          okText="Да"
          cancelText="Нет"
          onConfirm={clearBasket}
        >
          <div className="flex justify-end items-center gap-1 cursor-pointer hover:text-error">
            <span className="text-sm font-semibold">Очистить корзину</span>
            <DeleteOutlined />
          </div>
        </Popconfirm>
      </div>
      <div className="flex flex-col gap-4">
        {basketItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 items-center justify-between"
          >
            <img
              src={process.env.NEXT_PUBLIC_API_URL + item.images[0].url}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-2xl"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{item.name}</span>
              <span className="text-2xl font-bold text-gray-900">
                ₽{Number(item.price).toLocaleString("ru-RU")}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <Button onClick={() => decreaseItem(item.id)}>-</Button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <Button onClick={() => increaseItem(item.id)}>+</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end items-center">
        <span className="text-lg font-semibold">Итого:</span>
        <span className="text-2xl font-bold text-gray-900">
          ₽
          {basketItems
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toLocaleString("ru-RU")}
        </span>
      </div>

      <Button type="primary" onClick={() => hadnleOpenModalBasket()}>
        Узнать о наличии
      </Button>
    </div>
  );

  return (
    <>
      <OrderBasket open={moadalBasket} setOpen={setModalBasket} />
      <Popover zIndex={1} trigger={"click"} placement="bottomRight" content={content}>
        <ShoppingOutlined className="text-lg cursor-pointer" />
      </Popover>
    </>
  );
};
