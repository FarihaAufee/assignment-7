"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
}

type SortOption = "default" | "low" | "high";

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.abcz.workers.dev/api/bazardor/products?category=${category}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await res.json();

        setProducts(data);
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") {
      return a.today - b.today;
    }

    if (sort === "high") {
      return b.today - a.today;
    }

    return 0;
  });

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-10">
        <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="text-6xl">🔍</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            কোনো পণ্য পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-gray-500">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-pink-500 px-5 py-2.5 font-medium text-white transition hover:bg-pink-600"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const categoryName = products[0].categoryNameBn;
  const categoryIcon = products[0].categoryIcon;

  return (
    <div className="min-h-screen bg-[#f5f8f5]"> 
    <main className= " container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{categoryIcon}</span>

            <h1 className="text-3xl font-bold text-gray-900">
              {categoryName}
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {products.length.toLocaleString("bn-BD")}টি পণ্য
          </p>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm font-medium text-black"
          >
            সাজান:
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-gray-300 bg-white text-black px-3 py-2 text-sm outline-none"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low">কম দাম</option>
            <option value="high">বেশি দাম</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 text-6xl">
              {product.image}
            </div>

            <div className="mt-4">
              <h2 className="font-semibold text-gray-900">
                {product.nameBn}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                প্রতি {product.unit}
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {product.today.toLocaleString("bn-BD")} ৳
                  </p>

                  <p className="text-xs text-gray-500">
                    গতকাল: {product.yesterday.toLocaleString("bn-BD")} ৳
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.change.dir === "up"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {product.change.dir === "up" ? "▲" : "▼"}{" "}
                  {product.change.pct.toLocaleString("bn-BD")}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
    </div>
  );
};

export default CategoryPage;