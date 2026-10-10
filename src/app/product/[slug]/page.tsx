
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
  FaMagnifyingGlass,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaBoxOpen,
  FaRotateRight,
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

const API_URL =
  "https://api.abcz.workers.dev/api/bazardor/products";

const money = (value: number) =>
  Number(value || 0).toLocaleString("bn-BD");

export default function ProductDetails() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const { data: session, isPending } =
    authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(
        `/signin?callbackURL=${encodeURIComponent(
          `/product/${slug}`
        )}`
      );
    }
  }, [isPending, session, router, slug]);

  useEffect(() => {
    if (!slug || isPending || !session?.user) return;

    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        let found: Product | null = null;

        // Try the single-product API first.
        const response = await fetch(
          `${API_URL}/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const result = await response.json();

          const candidate =
            result?.product ??
            result?.data?.product ??
            result?.data ??
            result;

          if (
            candidate &&
            !Array.isArray(candidate) &&
            typeof candidate === "object" &&
            String(candidate.slug) === slug
          ) {
            found = candidate as Product;
          }
        }

        // If necessary, search the complete product list.
        if (!found) {
          const listResponse = await fetch(API_URL, {
            cache: "no-store",
          });

          if (!listResponse.ok) {
            throw new Error(
              `Products API error: ${listResponse.status}`
            );
          }

          const result = await listResponse.json();

          const list = Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : Array.isArray(result?.products)
                ? result.products
                : [];

          found =
            list.find(
              (item: Product) =>
                String(item.slug) === slug
            ) ?? null;
        }

        if (!cancelled) {
          if (found) {
            setProduct({
              ...found,
              today: Number(found.today) || 0,
              yesterday: Number(found.yesterday) || 0,
              change: found.change ?? {
                dir: "down",
                pct: 0,
              },
              markets: Array.isArray(found.markets)
                ? found.markets
                : [],
            });
          } else {
            setError(
              "এই পণ্যটি API-তে পাওয়া যায়নি।"
            );
          }
        }
      } catch (err) {
        console.error("Product loading error:", err);

        if (!cancelled) {
          setError(
            "পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug, isPending, session]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-screen bg-[#f5f8f5] p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-72 rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f8f5] px-4 py-10">
        <div className="mx-auto grid max-w-6xl animate-pulse gap-8 md:grid-cols-2">
          <div className="h-80 rounded-2xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-gray-200" />
            <div className="h-5 w-1/3 rounded bg-gray-200" />
            <div className="h-20 rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5] px-4">
        <div className="max-w-md text-center">
          <FaMagnifyingGlass className="mx-auto text-5xl text-gray-400" />

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            {product ? "সমস্যা হয়েছে" : "পণ্যটি পাওয়া যায়নি"}
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "আপনি যে পণ্যটি খুঁজছেন সেটি পাওয়া যায়নি।"}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-white hover:bg-green-700"
            >
              <FaRotateRight />
              আবার চেষ্টা করো
            </button>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const markets = product.markets;

  const prices = markets.flatMap((market) => [
    Number(market.min),
    Number(market.max),
  ]).filter(Number.isFinite);

  const minPrice = prices.length
    ? Math.min(...prices)
    : product.today;

  const maxPrice = prices.length
    ? Math.max(...prices)
    : product.today;

  const averagePrice = prices.length
    ? prices.reduce((sum, price) => sum + price, 0) /
      prices.length
    : product.today;

  const isRising = product.change.dir === "up";

  const isRemoteImage =
    /^https?:\/\//i.test(product.image || "");

  return (
    <main className="min-h-screen bg-[#f5f8f5]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600">
            হোম
          </Link>

          <span className="mx-2">/</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-600"
          >
            {product.categoryNameBn}
          </Link>

          <span className="mx-2">/</span>
          <span>{product.nameBn}</span>
        </nav>

        {/* Product information */}
        <section className="grid gap-8 md:grid-cols-2">

          {/* Image */}
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-white p-8 shadow-sm">
            {isRemoteImage ? (
              <Image
                src={product.image}
                alt={product.nameBn}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="text-8xl">
                {product.image || <FaBoxOpen />}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="mb-3 text-sm text-gray-500">
              {product.categoryIcon} {product.categoryNameBn}
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              {product.nameBn}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              প্রতি {product.unit}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-4xl font-bold text-gray-900">
                ৳{money(product.today)}
              </p>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  isRising
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {isRising ? (
                  <FaArrowTrendUp />
                ) : (
                  <FaArrowTrendDown />
                )}

                {money(product.change.pct)}%
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              গতকালের দাম: ৳{money(product.yesterday)}
            </p>

            {/* Price summary */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "সর্বনিম্ন দাম", value: minPrice },
                { label: "সর্বোচ্চ দাম", value: maxPrice },
                {
                  label: "গড় দাম",
                  value: Math.round(averagePrice),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white p-4 shadow-sm"
                >
                  <p className="text-xs text-gray-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ৳{money(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market prices */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">
            বাজারভিত্তিক দাম
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            বিভিন্ন বাজারে আজকের {product.nameBn}-এর দাম
          </p>

          <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <div className="grid min-w-[480px] grid-cols-3 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
              <span>বাজার</span>
              <span>বিভাগ</span>
              <span>দাম</span>
            </div>

            {markets.length > 0 ? (
              markets.map((market, index) => (
                <div
                  key={`${market.market}-${index}`}
                  className="grid min-w-[480px] grid-cols-3 items-center border-t border-gray-100 px-4 py-4 text-sm"
                >
                  <span className="font-medium text-gray-900">
                    {market.market}
                  </span>

                  <span className="text-gray-500">
                    {market.division}
                  </span>

                  <span className="font-semibold text-gray-900">
                    ৳{money(market.min)} – ৳{money(market.max)}
                  </span>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-500">
                বাজারভিত্তিক দামের তথ্য এখন পাওয়া যাচ্ছে না।
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}