"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Hero = () => {
  const [today, setToday] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const date = now.toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const currentTime = now.toLocaleTimeString("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setToday(date);
      setTime(currentTime);
    };

    // প্রথমবার সাথে সাথে দেখাবে
    updateDateTime();

    // প্রতি 1 second পরপর time update হবে
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-4 pt-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 md:flex-row md:py-10">

        {/* Left */}
        <div className="w-full md:max-w-2xl">

          {/* Date + Time */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              {today || "তারিখ লোড হচ্ছে..."}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              🕐 {time || "সময় লোড হচ্ছে..."}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl md:text-5xl">
            আজকের বাজারের দাম
            <br />
            এক নজরে
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত তথ্য এক জায়গায়।
          </p>

          <Link
            href="/categories"
            className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Image */}
        <div className="mt-8 flex w-full justify-center md:mt-0 md:w-auto">
          <Image
            src="/bazar-hero.png"
            alt="বাজার দর"
            width={280}
            height={230}
            priority
            className="h-auto w-52 object-contain sm:w-60 md:w-64"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;