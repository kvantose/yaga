import { Header } from '@/src/components/header/Header';
import { Button } from 'antd';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <Header />
      <h1 className="text-4xl font-bold mb-4">404 - Страница не найдена</h1>
      <p className="mb-8">Возможно, эта страница была перемещена или удалена.</p>
      <Button type="primary">
        <Link href="/">На главную</Link>
      </Button>

    </div>
  );
}