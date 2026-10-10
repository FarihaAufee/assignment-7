"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Marquee from "./Marquee";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const Navbar = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [today, setToday] = useState("");
  const [time, setTime] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Better Auth session
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  // ================= DATE & TIME =================
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setToday(
        now.toLocaleDateString("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );

      setTime(
        now.toLocaleTimeString("bn-BD", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();

    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= GET CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Category API Error:", error);
      }
    };

    fetchCategories();
  }, []);

  // ================= SIGN OUT =================
  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি!");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("SIGN OUT ERROR:", error);
      toast.error("আবার চেষ্টা করো!");
    } finally {
      setIsSigningOut(false);
    }
  };

  const activeCategory = "sobji";

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* ================= TOP ROW ================= */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="block shrink-0">
          <h1 className="flex items-center gap-2 text-xl font-bold text-green-700 sm:text-2xl">
            🛒 বাজার দর
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <span>{today || "তারিখ লোড হচ্ছে..."}</span>
            <span className="text-gray-300">|</span>
            <span>🕐 {time || "সময় লোড হচ্ছে..."}</span>
          </div>
        </Link>

        {/* ================= AUTHENTICATION ================= */}
        {isPending ? (
          <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
        ) : !isLoggedIn ? (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/signin"
              className="rounded-lg border border-green-600 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 sm:px-4"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 sm:px-4"
            >
              সাইন আপ
            </Link>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/profile"
              className="flex max-w-40 items-center gap-2 rounded-full border border-green-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 sm:max-w-52 sm:px-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green-100 text-sm font-bold text-green-700">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (session.user.name || "U").charAt(0).toUpperCase()
                )}
              </span>

              <span className="truncate">
                {session.user.name || "প্রোফাইল"}
              </span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
            >
              {isSigningOut ? "অপেক্ষা করুন..." : "সাইন আউট"}
            </button>
          </div>
        )}
      </div>

      {/* ================= CATEGORY NAVIGATION ================= */}
      <nav className="border-t border-gray-100">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:justify-center sm:gap-2 sm:px-6">
          {categories.map((category) => {
            const isActive = category.slug === activeCategory;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`flex items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= MARQUEE ================= */}
      <Marquee />
    </header>
  );
};

export default Navbar;
