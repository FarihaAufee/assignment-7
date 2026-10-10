"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaMagnifyingGlass,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
  markets: Market[];
}

const ProductDetails = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
const router = useRouter();

const { data: session, isPending } = authClient.useSession();


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://api.abcz.workers.dev/api/bazardor/products/${slug}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data: Product = await res.json();

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);
useEffect(() => {
  if (!isPending && !session?.user) {
    router.replace(`/signin?callbackURL=${encodeURIComponent(`/product/${slug}`)}`);
  }
}, [isPending, session, router, slug]);

if (isPending || (!session?.user && slug)) {
  return (
    <main className="min-h-screen bg-[#f5f8f5] px-4 py-10">
      <div className="mx-auto max-w-6xl animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-gray-200" />
        <div className="h-64 rounded-2xl bg-gray-200" />
      </div>
    </main>
  );
}
  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f8f5]">
        <div className="container mx-auto px-4 py-10">
          <div className="grid animate-pulse gap-8 md:grid-cols-2">
            <div className="h-80 rounded-2xl bg-gray-200" />

            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200" />
              <div className="h-20 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f8f5]">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaMagnifyingGlass className="text-3xl text-gray-400" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            পণ্যটি পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-gray-500">
            আপনি যে পণ্যটি খুঁজছেন সেটি বর্তমানে পাওয়া যাচ্ছে না।
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const marketPrices = product.markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minPrice =
    marketPrices.length > 0 ? Math.min(...marketPrices) : product.today;

  const maxPrice =
    marketPrices.length > 0 ? Math.max(...marketPrices) : product.today;

  const averagePrice =
    marketPrices.length > 0
      ? marketPrices.reduce((sum, price) => sum + price, 0) /
        marketPrices.length
      : product.today;

  const isRising = product.change.dir === "up";

  return (
    <main className="min-h-screen bg-[#f5f8f5]">
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-green-600">
            হোম
          </Link>

          <span className="mx-2">/</span>

          <Link
            href={`/category/${product.category}`}
            className="transition hover:text-green-600"
          >
            {product.categoryNameBn}
          </Link>

          <span className="mx-2">/</span>

          <span>{product.nameBn}</span>
        </div>

        {/* Product Summary */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image */}
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white shadow-sm">
            <span className="text-8xl">{product.image}</span>
          </div>

          {/* Details */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">
                {product.categoryIcon}
              </span>

              <span className="text-sm text-gray-500">
                {product.categoryNameBn}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              প্রতি {product.unit}
            </p>

            {/* Today's Price */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-4xl font-bold text-gray-900">
                {product.today.toLocaleString("bn-BD")} ৳
              </p>

              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  isRising
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {isRising ? (
                  <FaArrowTrendUp className="text-sm" />
                ) : (
                  <FaArrowTrendDown className="text-sm" />
                )}

                {product.change.pct.toLocaleString("bn-BD")}%
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              গতকাল: {product.yesterday.toLocaleString("bn-BD")} ৳
            </p>

            {/* Price History */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  সর্বনিম্ন
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {minPrice.toLocaleString("bn-BD")} ৳
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  সর্বোচ্চ
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {maxPrice.toLocaleString("bn-BD")} ৳
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">
                  গড় দাম
                </p>

                <p className="mt-1 text-lg font-bold text-gray-900">
                  {Math.round(averagePrice).toLocaleString("bn-BD")} ৳
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Market Prices */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              বাজারভিত্তিক দাম
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারে আজকের {product.nameBn}-এর দাম
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              <span>বাজার</span>
              <span>বিভাগ</span>
              <span>দাম</span>
            </div>

            {/* Market Data */}
            {product.markets.map((market, index) => (
              <div
                key={`${market.market}-${index}`}
                className="grid grid-cols-3 items-center border-t border-gray-200 px-4 py-4 text-sm"
              >
                <span className="font-medium text-gray-900">
                  {market.market}
                </span>

                <span className="text-gray-500">
                  {market.division}
                </span>

                <span className="font-semibold text-gray-900">
                  {market.min.toLocaleString("bn-BD")} –{" "}
                  {market.max.toLocaleString("bn-BD")} ৳
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;