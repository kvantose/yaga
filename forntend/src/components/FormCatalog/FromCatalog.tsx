"use client";

import { Button, Input, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import Upload from "antd/es/upload";
import { useEffect, useState } from "react";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useCatalogStore } from "@/src/store/catalog.store";

export interface CreateCatalogDto {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

export const FromCatalog = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);

  const { fetchItems, addItem, uploadImage, clearError } = useCatalogStore();

  useEffect(() => {
    fetchItems();
  }, []);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      message.error("Введите название товара");
      return false;
    }
    if (!description.trim()) {
      message.error("Введите описание");
      return false;
    }
    if (!category) {
      message.error("Выберите категорию");
      return false;
    }

    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      message.error("Введите корректную цену");
      return false;
    }

    if (!imageFile?.originFileObj) {
      message.error("Выберите изображение");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setImageFile(null);
    clearError();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!imageFile?.originFileObj) return;

    try {
      const imageUrl = await uploadImage(imageFile.originFileObj);
      const parsedPrice = parseFloat(price);
      const itemData: CreateCatalogDto = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: parsedPrice,
        image: imageUrl,
      };

      const newItem = await addItem(itemData);

      if (newItem) {
        message.success(`Товар "${name}" успешно добавлен!`);
        resetForm();
      }
    } catch (error) {
      console.error("Ошибка формы:", error);
    }
  };

  const handleImageChange = (info: UploadChangeParam) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0];
      if (file.type && !file.type.startsWith("image/")) {
        message.error("Можно загружать только изображения");
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) {
      return;
    }
    setPrice(sanitizedValue);
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="w-full bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Добавить товар</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название товара *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Худи черное"
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Описание *</label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание товара..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Категория *
            </label>
            <Select
              value={category || undefined}
              onChange={setCategory}
              placeholder="Выберите категорию"
              style={{ width: "100%" }}
              size="large"
              options={[
                { value: "Одежда", label: "Одежда" },
                { value: "Худи", label: "Худи" },
                { value: "Футболки", label: "Футболки" },
                { value: "Брюки", label: "Брюки" },
                { value: "Кардиганы", label: "Кардиганы" },
                { value: "Аксессуары", label: "Аксессуары" },
                { value: "Украшения", label: "Украшения" },
                { value: "Головные уборы", label: "Головные уборы" },
                { value: "Шарфы", label: "Шарфы" },
                { value: "Варежки", label: "Варежки" },
                { value: "Сумки", label: "Сумки" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Цена (рубли) *
            </label>
            <Input
              value={price === null ? "" : price}
              onChange={handlePriceChange}
              type="number"
              placeholder="1999"
              min={0}
              step={0.01}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Изображение *
            </label>
            <Upload
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handleImageChange}
              onRemove={() => setImageFile(null)}
            >
              <Button>Выбрать изображение</Button>
            </Upload>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="w-full mt-6"
          >
            Добавить товар
          </Button>
        </div>
      </div>
    </div>
  );
};
