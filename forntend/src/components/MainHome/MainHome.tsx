import { Button } from "antd";

export const MainHome = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      flex flex-col items-center gap-5
      backdrop-blur-md
      w-11/12 md:w-1/2
      p-5
      border border-white rounded-2xl
      box-shadow[0_20px_60px_rgba(0,0,0,0.6)]
      ">
      <h1 className="text-4xl md:text-6xl font-bold text-center">ЕЛОМА — одежда для свободы движения в ритме города</h1>
      <h3>YAGA ART — CONCEPTUAL FASHION</h3>

      <div className="flex gap-3">
        <Button size="large" type="primary" href="#catalog">Каталог</Button>
        <Button size="large" href="#contacts">Контакты</Button>
      </div>
    </div>
  );
};
