import { useEffect } from "react";
import { CreateCatalogDto, CatalogApiDto, useCatalogStore } from "@/src/store/catalog.store";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  UploadFile,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import type { UploadChangeParam } from "antd/es/upload";
import { CATEGORIES } from "@/src/data/categories";

interface ModalProps {
  item: CreateCatalogDto & { id: string };
  modalEditCard: boolean;
  setModalEditCard: (value: boolean) => void;
}

interface FormValues {
  name: string;
  description: string;
  category: string;
  price: number;
  image: UploadFile[];
}

export const EditCard = ({
  item,
  modalEditCard,
  setModalEditCard,
}: ModalProps) => {
  const [form] = Form.useForm<FormValues>();
  const { editItem, uploadImages } = useCatalogStore();

  // Обработчик изменений в Upload компоненте
  const normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) return e;
    return e?.fileList || [];
  };
  
  useEffect(() => {
    if (!item) return;

    form.setFieldsValue({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      image: item.images.map((image) => ({
        uid: image.id || image.url,
        url: image.url,
        name: image.url.split('/').pop() || 'image',
        status: 'done' as const,
      })),
    });
  }, [item, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      // 1️⃣ Старые изображения (уже загруженные)
      const existingUrls = values.image
        .filter((file) => !file.originFileObj)
        .map((file) => file.url!)
        .filter(Boolean);

      // 2️⃣ Новые файлы
      const newFiles = values.image
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);

      // 3️⃣ Загружаем новые
      const uploadedUrls = newFiles.length ? await uploadImages(newFiles) : [];

      // 4️⃣ Финальный массив URL (строки)
      const images = [...existingUrls, ...uploadedUrls];

      // Создаем payload для отправки на бэкенд (бэкенд ожидает images: string[])
      const payload: CatalogApiDto = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category,
        price: values.price,
        images, // массив строк URL
      };

      await editItem(item.id, payload);

      message.success("Товар успешно обновлён");
      form.resetFields();
      setModalEditCard(false);
    } catch (error) {
      console.error(error);
      message.error("Ошибка при обновлении товара");
    }
  };

  return (
    <Modal
      open={modalEditCard}
      onCancel={() => setModalEditCard(false)}
      footer={null}
      width={900}
      centered
    >
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Редактирование товара</h2>

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
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: "Заполните описание" }]}
          >
            <TextArea rows={4} showCount maxLength={500} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="Категория"
              rules={[{ required: true }]}
            >
              <Select size="large" options={CATEGORIES} />
            </Form.Item>

            <Form.Item
              name="price"
              label="Цена"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber className="w-full" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="image"
            label="Фотографии"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Добавьте хотя бы одно изображение" }]}
          >
            <Upload
              listType="picture-card"
              maxCount={10}
              beforeUpload={() => false}
              accept="image/*"
              onRemove={() => {
                return true;
              }}
            >
              {form.getFieldValue("image")?.length >= 10 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Загрузить</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            Сохранить изменения
          </Button>
        </Form>
      </div>
    </Modal>
  );
};
