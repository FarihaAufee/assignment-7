
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaMagnifyingGlass,
} from "react-icons/fa6";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
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
};

type Props = {
  product: Product;
};

const formatPrice = (price: number) =>
  `${Number(price).toLocaleString("bn-BD")} ৳`;

export default function ProductDetails({ product }: Props) {
  const markets = Array.isArray(product.markets) ? product.markets : [];

  const marketPrices = markets.flatMap((market) => [
    Number(market.min),
    Number(market.max),
  ]).filter(Number.isFinite);

  const minPrice = marketPrices.length
    ? Math.min(...marketPrices)
    : Number(product.today) || 0;

  const maxPrice = marketPrices.length
    ? Math.max(...marketPrices)
    : Number(product.today) || 0;

  const averagePrice = marketPrices.length
    ? Math.round(
        marketPrices.reduce((sum, price) => sum + price, 0) /
          marketPrices.length
      )
    : Number(product.today) || 0;

  const isRising = product.change?.dir === "up";
  const imageUrl =
    typeof product.image === "string" &&
    /^https?:\/\//i.test(product.image);

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 text-[#26352b] sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="hover:text-green-700">
            হোম
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-700"
          >
            {product.categoryNameBn || "পণ্য"}
          </Link>
          <span>/</span>
          <span className="text-gray-700">{product.nameBn}</span>
        </nav>

        {/* Product Header */}
        <section className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5f0] sm:h-28 sm:w-28">
              {imageUrl ? (
                <Image
                  src={product.image}
                  alt={product.nameBn}
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-4xl">
                  {product.image || product.categoryIcon || "🛒"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>{product.categoryIcon}</span>
                <span>{product.categoryNameBn}</span>
              </div>

              <h1 className="text-xl font-bold sm:text-2xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                প্রতি {product.unit}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                বাংলাদেশের বিভিন্ন বাজারের আজকের দাম 
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[#f0f5f0] p-4 sm:min-w-40 sm:text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>

            <p className="mt-1 text-3xl font-bold">
              {formatPrice(Number(product.today) || 0)}
            </p>

            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isRising
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isRising ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
              {Number(product.change?.pct || 0).toLocaleString("bn-BD")}%
            </span>

            <p className="mt-2 text-xs text-gray-500">
              গতকাল: {formatPrice(Number(product.yesterday) || 0)}
            </p>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">দামের সারসংক্ষেপ</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-[#fbfdfb] p-4">
              <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-2 text-xl font-bold text-green-700">
                {formatPrice(minPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                প্রতি {product.unit}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#fbfdfb] p-4">
              <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-2 text-xl font-bold text-red-600">
                {formatPrice(maxPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                প্রতি {product.unit}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-[#fbfdfb] p-4">
              <p className="text-sm text-gray-500">গড় দাম</p>
              <p className="mt-2 text-xl font-bold text-green-800">
                {formatPrice(averagePrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                প্রতি {product.unit}
              </p>
            </div>
          </div>
        </section>

        {/* Market Prices */}
        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
            <p className="mt-1 text-sm text-gray-500">
              বিভিন্ন বাজারে {product.nameBn}-এর দাম
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead className="bg-[#f8faf8] text-xs text-gray-500">
                  <tr>
                    <th className="px-4 py-3">বাজার</th>
                    <th className="px-4 py-3">বিভাগ</th>
                    <th className="px-4 py-3">সর্বনিম্ন</th>
                    <th className="px-4 py-3">সর্বোচ্চ</th>
                    <th className="px-4 py-3">গড় দাম</th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-t border-gray-100 even:bg-[#f8faf8] hover:bg-green-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {market.market}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {market.division}
                      </td>
                      <td className="px-4 py-3">
                        {formatPrice(Number(market.min) || 0)}
                      </td>
                      <td className="px-4 py-3">
                        {formatPrice(Number(market.max) || 0)}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatPrice(
                          Math.round(
                            (Number(market.min) + Number(market.max)) / 2
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-[#f8faf8] px-4 py-10 text-center">
              <FaMagnifyingGlass className="mx-auto text-2xl text-gray-400" />
              <p className="mt-3 font-medium">বাজারের তথ্য পাওয়া যায়নি</p>
              <p className="mt-1 text-sm text-gray-500">
                এই পণ্যের জন্য বর্তমানে কোনো বাজারের দাম নেই।
              </p>
            </div>
          )}
        </section>

        {/* Price History */}
        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">আগের দামের তথ্য</h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f8faf8] p-4">
              <p className="text-sm text-gray-500">গতকাল</p>
              <p className="mt-2 font-bold">
                {formatPrice(Number(product.yesterday) || 0)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8faf8] p-4">
              <p className="text-sm text-gray-500">গত সপ্তাহ</p>
              <p className="mt-2 font-bold">
                {formatPrice(Number(product.lastWeek) || 0)}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8faf8] p-4">
              <p className="text-sm text-gray-500">গত মাস</p>
              <p className="mt-2 font-bold">
                {formatPrice(Number(product.lastMonth) || 0)}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
