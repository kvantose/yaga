import { CreateCatalogDto } from "@/src/store/catalog.store";
import { Modal } from "antd";
import { CarouselImages } from "../../CarouselImages/CarouselImages";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModalProps {
  item: CreateCatalogDto;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export const ModalCatalog = ({ item, modalOpen, setModalOpen }: ModalProps) => {
  return (
    <Modal
      title={null}
      open={modalOpen}
      onCancel={() => setModalOpen(false)}
      footer={null}
      width={900}
      centered
    >
      <div className="flex flex-col md:flex-row relative">
        <div className="md:w-1/2 w-full">
          <CarouselImages images={item.images} />
        </div>

        {/* INFO */}
        <div className="md:w-1/2 w-full p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {item.name}
            </h2>

            <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
              {item.category}
            </span>
          </div>

          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                br: () => <br />,
              }}
            >
              {item.description}
            </ReactMarkdown>
          </div>
          <p className="text-3xl font-bold">
            ₽{Number(item.price).toLocaleString("ru-RU")}
          </p>
        </div>
      </div>
    </Modal>
  );
};
