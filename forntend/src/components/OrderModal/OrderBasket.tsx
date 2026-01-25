import { useBasketStore } from "@/src/store/basket.store";
import { Button, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";

interface OrderBasketProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const OrderBasket = ({ open, setOpen }: OrderBasketProps) => {
  const {
    basketItems,
    increaseItem,
    decreaseItem,
    sendBasket,
    success,
    loading,
    error,
  } = useBasketStore();
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");

  const handleSend = async () => {
    if (!phone || !telegram) {
      message.warning("Заполните все поля");
      return;
    }
    await sendBasket(phone, telegram);
  };

  useEffect(() => {
    if (success) {
      message.success("Спасибо за заказ");
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      title="Ваш заказ"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label>Телефон *</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label>Telegram *</label>
            <Input
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>
        </div>

        <div>
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
                  <Button onClick={() => increaseItem(item.id)}>+</Button>{" "}
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
        </div>
        <Button loading={loading} type="primary" onClick={handleSend}>
          Отправить
        </Button>
      </div>
    </Modal>
  );
};
