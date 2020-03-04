"use client";

import { Header } from "@/src/components/header/Header";
import { Button, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminPanel() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleClick = () => {
    if (
      login === process.env.NEXT_PUBLIC_ADMIN_LOGIN &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin-panel/panel");
    } else {
      message.error("Неверный логин или пароль");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen p-3">
      <Header />
      <div className="flex flex-col gap-3 items-center justify-center bg-white p-5 rounded-xl w-full md:w-1/2">
        <Input value={login} onChange={(e) => setLogin(e.target.value)} />
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={() => handleClick()} type="primary" className="w-full">
          Войти
        </Button>
      </div>
    </div>
  );
}
