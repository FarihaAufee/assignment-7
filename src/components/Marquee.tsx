"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const PriceMarquee = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/categories",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();

        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
        তথ্য লোড হচ্ছে...
      </div>
    );
  }

  // No data
  if (!categories.length) {
    return null;
  }

  return (
    <div className="overflow-hidden border-t border-gray-200 bg-gray-50 py-3">
      <div
        className="flex w-max"
        style={{
          animation: "marquee 30s linear infinite",
        }}
      >
        {/* Duplicate data for continuous scrolling */}
        {[...categories, ...categories].map((category, index) => (
          <div
            key={`${category.id}-${index}`}
            className="flex items-center gap-2 whitespace-nowrap px-6 text-sm"
          >
            {/* Icon */}
            <span className="text-base">
              {category.icon}
            </span>

            {/* Category name */}
            <span className="font-semibold text-gray-700">
              {category.nameBn}
            </span>

            {/* Separator */}
            <span className="text-gray-300">•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default PriceMarquee;