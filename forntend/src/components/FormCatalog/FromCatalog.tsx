"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  InputNumber,
  message,
  Card,
  Popover,
} from "antd";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import { useCatalogStore, CatalogApiDto } from "@/src/store/catalog.store";
import { CATEGORIES } from "@/src/data/categories";
const { TextArea } = Input;

interface FormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  image: UploadFile[];
}

const PopoverMarkdown = () => (
  <Popover content={<MarkdownHint />} placement="right">
    <span className="flex items-center gap-2 cursor-pointer">
      Описание
      <QuestionCircleOutlined className="text-gray-400 hover:text-gray-600" />
    </span>
  </Popover>
);

const MarkdownHint = () => (
  <div className="text-sm space-y-2 max-w-xs">
    <p className="font-semibold">Поддерживается Markdown:</p>

    <div className="font-mono bg-gray-50 p-2 rounded text-xs space-y-1">
      <div>**Жирный**</div>
      <div>*Курсив*</div>
      <div>~~Зачёркнутый~~</div>
      <div># Заголовок</div>
      <div>- Пункт списка</div>
      <div>[Ссылка](https://example.com)</div>
    </div>

    <p className="text-gray-500 text-xs">
      Перенос строки — просто 2 раза Enter
    </p>
    <a
      href="https://texterra.ru/blog/ischerpyvayushchaya-shpargalka-po-sintaksisu-razmetki-markdown-na-zametku-avtoram-veb-razrabotchikam.html"
      target="_blank"
      className="text-blue-500 hover:underline"
    >
      Подробнее
    </a>
  </div>
);

export const FromCatalog = () => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const { addItem, uploadImages } = useCatalogStore();

  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const handleSubmit = async (values: FormValues) => {
    const files = values.image
      ?.map((file) => file.originFileObj)
      .filter(Boolean) as File[];

    if (!files || files.length === 0) {
      message.error("Пожалуйста, выберите изображения");
      return;
    }

    setLoading(true);
    try {
      const uploadedUrls = await uploadImages(files);

      if (!uploadedUrls.length) {
        throw new Error("Не удалось загрузить изображения");
      }

      const itemData: CatalogApiDto = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category,
        price: values.price,
        images: uploadedUrls,
      };

      await addItem(itemData);

      message.success(`Товар "${itemData.name}" успешно добавлен!`);
      form.resetFields();
      form.setFieldsValue({ image: [] });
    } catch (error) {
      console.error(error);
      message.error("Не удалось создать карточку товара");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <Card title="Новый товар" className="shadow-sm border-gray-200">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Введите название" }]}
          >
            <Input placeholder="Например: Худи oversize" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label={PopoverMarkdown()}
            rules={[{ required: true, message: "Заполните описание" }]}
          >
            <TextArea
              rows={6}
              placeholder={`**Жирный текст**
*Курсив*
- список
[Ссылка](https://example.com)`}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Select
              placeholder="Выбрать..."
              size="large"
              options={CATEGORIES}
            />
          </Form.Item>

          <Form.Item
            className="w-full"
            name="price"
            label="Цена"
            rules={[
              { required: true, message: "Укажите цену" },
              { type: "number", min: 1, message: "Минимум 1 ₽" },
            ]}
          >
            <InputNumber className="w-full" size="large" placeholder="0" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Фотография"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload
              maxCount={10}
              listType="picture-card"
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Загрузить</div>
              </div>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="mt-4"
          >
            Создать карточку
          </Button>
        </Form>
      </Card>
    </div>
  );
};
