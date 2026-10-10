"use client";

import { useEffect, useState } from "react";
import { FaArrowTrendDown } from "react-icons/fa6";

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

const FallingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/products",
          {
            cache: "no-store",
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
            : [];

        const fallingProducts = productList
          .filter(
            (product) =>
              product?.change?.dir === "down" &&
              typeof product?.change?.pct === "number"
          )
          .sort((a, b) => b.change.pct - a.change.pct)
          .slice(0, 6);

        setProducts(fallingProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading
  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <div className="h-7 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  // No data
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          আজ দাম কমেছে
          <FaArrowTrendDown className="text-lg text-red-600 sm:text-xl" />
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Product Info */}
            <div className="flex items-center gap-3">
              {/* Image */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-3xl">
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

            {/* Price + Percentage */}
            <div className="mt-5 flex items-end justify-between">
              {/* Price */}
              <div>
                <p className="text-xs text-gray-500">
                  আজকের দাম
                </p>

                <p className="mt-0.5 text-xl font-bold text-gray-900">
                  {Number(product.today).toLocaleString("bn-BD")} টাকা
                </p>
              </div>

              {/* Percentage */}
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                <FaArrowTrendDown className="text-[10px]" />

                {Number(product.change.pct).toLocaleString("bn-BD")}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FallingProducts;