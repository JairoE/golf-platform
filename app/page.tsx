"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [router]);

  return null;
}
