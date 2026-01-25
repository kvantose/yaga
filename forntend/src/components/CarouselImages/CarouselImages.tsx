import { Carousel } from "antd";
import type { CreateCatalogDto } from "@/src/store/catalog.store";

type CarouselImagesProps = Pick<CreateCatalogDto, "images">;

export const CarouselImages = ({ images }: CarouselImagesProps) => {
  return (
    <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100">
      <Carousel arrows dotPlacement="bottom" infinite>
        {images.map((image, index) => (
          <img
            key={index}
            src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`}
            alt={`Image ${index}`}
            className="w-full h-full object-cover"
          />
        ))}
      </Carousel>
    </div>
  );
};
