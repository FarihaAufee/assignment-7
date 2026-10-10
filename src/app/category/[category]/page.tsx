
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

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `https://api.abcz.workers.dev/api/bazardor/products?category=${encodeURIComponent(category)}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await res.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Error fetching category products:", err);
        setProducts([]);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (category) {
      fetchProducts();
    }

    return () => controller.abort();
  }, [category]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return a.today - b.today;
    if (sort === "high") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f8f5] px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border border-gray-100 bg-white p-5"
              >
                <div className="h-32 rounded-lg bg-gray-200" />
                <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
                <div className="mt-5 h-6 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || products.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f5f8f5] px-4 py-16">
        <div className="max-w-md text-center">
          <div className="text-6xl">🔍</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            {error ? "পণ্য লোড করা যায়নি" : "কোনো পণ্য পাওয়া যায়নি"}
          </h1>

          <p className="mt-2 text-gray-500">
            {error
              ? "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করো।"
              : "এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।"}
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-pink-500 px-5 py-3 font-medium text-white transition hover:bg-pink-600"
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
    <main className="min-h-screen bg-[#f5f8f5] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Category Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{categoryIcon}</span>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {categoryName}
              </h1>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              মোট {products.length.toLocaleString("bn-BD")}টি পণ্য
            </p>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              সাজান:
            </label>

            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="max-w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.nameBn}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">{categoryIcon || "🛒"}</span>
                )}
              </div>

              <div className="mt-4">
                <h2 className="font-semibold text-gray-900">
                  {product.nameBn}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit}
                </p>

                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">আজকের দাম</p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {product.today.toLocaleString("bn-BD")} টাকা
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      গতকাল: {product.yesterday.toLocaleString("bn-BD")} টাকা
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.change.pct === 0
                        ? "bg-gray-100 text-gray-500"
                        : product.change.dir === "up"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                    }`}
                  >
                    {product.change.pct === 0
                      ? "—"
                      : product.change.dir === "up"
                        ? "▲"
                        : "▼"}{" "}
                    {product.change.pct.toLocaleString("bn-BD")}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}