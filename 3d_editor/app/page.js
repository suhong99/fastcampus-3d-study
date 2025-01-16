"use client";

import Image from "next/image";
import { useLoading } from "../context/loadingContext";
import Link from "next/link";

const Home = () => {
  const { setIsLoading } = useLoading();
  return (
    <div className="flex flex-1 items-center justify-center">
      <Link href="/editor" className="bg-[#eeeeee] px-4 py-2 rounded">
        3D 에디터 열기
      </Link>
    </div>
  );
};

export default Home;
