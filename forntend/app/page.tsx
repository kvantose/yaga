import Slick from "@/src/components/backgroundAnimation/silkPlane";
import { Header } from "@/src/components/header/Header";
import { MainHome } from "@/src/components/MainHome/MainHome";
import { AboutUs } from "@/src/components/AboutUs/AboutUs";
import { WrapperCatalog } from "@/src/components/WrapperCatalog/WrapperCatalog";
import { Map } from "@/src/components/Map/Map";
import { FeedBack } from "@/src/components/Feedback/Feedback";
import tg from "@/public/telegram.png";
import vk from "@/public/vk.png";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/src/components/Footer/Footer";
export default function Home() {
  return (
    <div
      style={{ maxWidth: "1350px" }}
      className="mx-auto flex flex-col items-center justify-center"
    >
      <div className="w-full h-screen pl-3 pr-3 pb-6">
        <Slick
          speed={10}
          scale={1}
          color="#dfd6d1"
          noiseIntensity={0}
          rotation={0}
        />
        <Header />
        <MainHome />
        <div className="flex flex-col gap-20">
          <AboutUs />
          <WrapperCatalog />
          <FeedBack />
          <Map />
            <Footer />
          <div className="fixed bottom-5 right-0 flex flex-col gap-3 bg-white rounded-bl-2xl rounded-tl-2xl p-3">
            <Link
              href="https://web.telegram.org/k/#@Brend_Eloma"
              target="_blank"
            >
              <Image src={tg} alt="tg" width={32} height={32} />
            </Link>
            <Link href="https://vk.com/yaga_yagova" target="_blank">
              <Image src={vk} alt="vk" width={32} height={32} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
