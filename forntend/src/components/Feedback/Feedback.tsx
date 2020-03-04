"use client";

import { useTelegram } from "@/src/store/telegram.store";
import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

export const FeedBack = () => {
  const [question, setQuestion] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");

  const { sendToTelegram, error, success, loading, clearError } = useTelegram();

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      message.success("Сообщение успешно отправлено");
    }
  }, [success]);

  const handleClick = async () => {
    if (!question || !phone || !telegram) {
      message.warning("Заполните все поля");
      return;
    }

    await sendToTelegram(question, phone, telegram);

    setQuestion("");
    setPhone("");
    setTelegram("");
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4">
        Остались вопросы? Напишите нам
      </h1>

      <div>
        <label className="block text-sm font-medium mb-2">Ваш вопрос *</label>
        <TextArea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ваш вопрос"
          rows={4}
          minLength={10}
          maxLength={500}
          showCount
        />
      </div>

      <div className="flex gap-3">
        <div className="w-full">
          <label className="block text-sm font-medium mb-2">Телефон *</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ваш телефон"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium mb-2">Телеграм *</label>
          <Input
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="Ваш телеграм"
          />
        </div>
      </div>

      <Button type="primary" loading={loading} onClick={handleClick}>
        Отправить
      </Button>
    </div>
  );
};
