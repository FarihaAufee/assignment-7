
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
}

const AllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productList: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.products)
              ? data.products
              : [];

        setProducts(productList);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
        <p className="mt-3 text-gray-500">
          কোনো পণ্য পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          সব পণ্য
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          আজকের বাজারের সকল পণ্যের দাম
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const isRising = product.change?.dir === "up";

          return (
            <div
              key={product.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Product Info */}
              <div className="flex items-center gap-3">
                {/* Product Image */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 text-3xl">
                  {product.image || "🛒"}
                </div>

                {/* Name + Unit */}
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-900">
                    {product.nameBn}
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    প্রতি {product.unit}
                  </p>
                </div>
              </div>

              {/* Price + Change */}
              <div className="mt-5 flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500">আজকের দাম</p>

                  <p className="mt-0.5 text-xl font-bold text-gray-900">
                    {Number(product.today).toLocaleString("bn-BD")} টাকা
                  </p>
                </div>

                {product.change && (
                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      isRising
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {isRising ? (
                      <FaArrowTrendUp className="text-[10px]" />
                    ) : (
                      <FaArrowTrendDown className="text-[10px]" />
                    )}

                    {Number(product.change.pct).toLocaleString("bn-BD")}%
                  </span>
                )}
              </div>

              {/* Product Details Link */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <Link
                  href={`/product/${encodeURIComponent(product.slug)}`}
                  className="flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  বিস্তারিত দেখুন →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AllProducts;
