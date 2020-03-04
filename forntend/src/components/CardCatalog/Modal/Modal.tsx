import { ICatalog } from "@/src/types/catalog.interface";
import { Modal } from "antd";

interface ModalProps {
  item: ICatalog;
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
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${item.image}`}
            alt={item.name}
            className="w-full object-cover rounded-2xl"
          />
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

          <p className="text-gray-600 text-sm leading-relaxed">
            {item.description}
          </p>
          <p className="text-3xl font-bold">
            ₽{Number(item.price).toLocaleString("ru-RU")}
          </p>
        </div>
      </div>
    </Modal>
  );
};
