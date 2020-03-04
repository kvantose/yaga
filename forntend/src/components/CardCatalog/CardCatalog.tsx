import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCatalogStore } from "@/src/store/catalog.store";
import { ModalCatalog } from "./Modal/Modal";
import { ICatalog } from "@/src/types/catalog.interface";
import { useBasketStore } from "@/src/store/basket.store";

interface CatalogCardProps {
  item: ICatalog;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const CatalogCard = ({ item, isAdmin = false }: CatalogCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { removeItem } = useCatalogStore();
  const { basketItems, addItem, decreaseItem, increaseItem } =
    useBasketStore();

  const imageSrc = item.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${item.image}`
    : "/placeholder-image.jpg";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeItem(item.id);
      message.success("Товар успешно удален");
    } catch (error) {
      message.error("Не удалось удалить товар");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAdmin && (
        <div
          className={`absolute top-4 right-4 z-10 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <Popconfirm
            title="Удалить товар?"
            description="Вы уверены, что хотите удалить этот товар?"
            onConfirm={handleDelete}
            okText="Да"
            cancelText="Нет"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={isDeleting}
              className="shadow-md hover:shadow-lg"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      )}
      {modalOpen && ModalCatalog({ item, setModalOpen, modalOpen })}
      <div
        className="relative w-full aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        onClick={() => setModalOpen(true)}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Цена</span>
            <span className="text-2xl font-bold text-gray-900">
              ₽{Number(item.price).toLocaleString("ru-RU")}
            </span>
          </div>
          {basketItems.some((basketItem) => basketItem.id === item.id) ? (
            <div className="flex items-center gap-2">
              <Button onClick={() => decreaseItem(item.id)}>-</Button>
              <span className="text-lg font-bold text-gray-900">
                {
                  basketItems.find((basketItem) => basketItem.id === item.id)
                    ?.quantity
                }
              </span>
              <Button onClick={() => increaseItem(item.id)}>+</Button>
            </div>
          ) : (
            <Button type='primary' onClick={() => addItem(item)}>В корзину +</Button>
          )}
        </div>
      </div>
    </div>
  );
};
