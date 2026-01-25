import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CreateCatalogDto, useCatalogStore } from "@/src/store/catalog.store";
import { ModalCatalog } from "./Modal/Modal";
import { useBasketStore } from "@/src/store/basket.store";
import { CarouselImages } from "../CarouselImages/CarouselImages";
import { EditOutlined } from "@ant-design/icons";
import { EditCard } from "./Modal/EditCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface CatalogCardProps {
  item: CreateCatalogDto;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const CatalogCard = ({ item, isAdmin = false }: CatalogCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditCard, setModalEditCard] = useState(false);
  const { removeItem } = useCatalogStore();
  const { basketItems, addItem, decreaseItem, increaseItem } = useBasketStore();

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
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col h-full">
      {isAdmin && (
        <>
          <div
            className={`absolute top-4 right-4 z-10 flex gap-2 transition-all duration-300`}
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
                Удалить
              </Button>
            </Popconfirm>
          </div>
          <div className="absolute top-15 right-4 z-10">
            <Button
              onClick={() => setModalEditCard(true)}
              size="small"
              type="primary"
              icon={<EditOutlined />}
              className="shadow-md hover:shadow-lg"
            >
              Редактировать
            </Button>
          </div>
        </>
      )}
      {modalEditCard && (
        <EditCard
          item={item}
          modalEditCard={modalEditCard}
          setModalEditCard={setModalEditCard}
        />
      )}
      {modalOpen && ModalCatalog({ item, setModalOpen, modalOpen })}
      <div onClick={() => setModalOpen(true)} className="shrink-0">
        <CarouselImages images={item.images} />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="mb-3 grow flex flex-col min-h-0">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1 shrink-0">
            {item.name}
          </h3>
          <div className="prose prose-neutral max-w-none overflow-hidden grow min-h-0">
            <div className="max-h-24 overflow-y-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  br: () => <br />,
                  p: ({ children }) => <p className="text-sm text-gray-600 line-clamp-3 mb-0">{children}</p>,
                }}
              >
                {item.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 shrink-0">
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
            <Button type="primary" onClick={() => addItem(item)}>
              В корзину +
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
