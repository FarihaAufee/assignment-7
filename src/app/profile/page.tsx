"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaArrowLeft,
  FaSignOutAlt,
  FaPen,
} from "react-icons/fa";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const image = (formData.get("image") as string).trim();

    if (!name) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name,
        image: image || null,
      });

      if (error) {
        toast.error(error.message || "Profile update করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      setShow(false);
      router.refresh();
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে Sign out হয়েছে");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("Sign out করা যায়নি");
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8f5]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f5f8f5] px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <FaUser className="text-2xl" />
        </div>

        <h1 className="text-xl font-bold text-gray-900">
          আপনার অ্যাকাউন্টে Sign in করুন
        </h1>

        <Link
          href="/signin"
          className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f5] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
        >
          <FaArrowLeft />
          হোম পেজে ফিরে যান
        </Link>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Header */}
          <div className="bg-green-700 px-6 py-7 text-white sm:px-8">
            <p className="text-sm text-green-100">
              🛒 বাজার দর
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              আমার প্রোফাইল
            </h1>

            <p className="mt-2 text-sm text-green-100">
              আপনার অ্যাকাউন্টের তথ্য পরিচালনা করুন।
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* User Information */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-green-50 text-3xl font-bold text-green-700 ring-2 ring-green-600 ring-offset-4">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile picture"
                    width={96}
                    height={96}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)?.toUpperCase() || <FaUser />
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {user.name || "ব্যবহারকারী"}
              </h2>

              <p className="mt-2 break-all text-sm text-gray-500">
                {user.email}
              </p>

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 font-semibold text-white transition hover:bg-green-800"
              >
                <FaPen className="text-sm" />
                {show ? "বন্ধ করুন" : "প্রোফাইল সম্পাদনা"}
              </button>
            </div>

            {/* Edit Form */}
            {show && (
              <form
                onSubmit={handleUpdateProfile}
                className="mt-8 space-y-5 rounded-xl border border-gray-100 bg-[#f9fbf9] p-5 sm:p-6"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    <FaUser className="mr-2 inline text-green-700" />
                    আপনার নাম
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name || ""}
                    placeholder="আপনার নাম লিখুন"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    <FaEnvelope className="mr-2 inline text-green-700" />
                    ইমেইল
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500 outline-none"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    ইমেইল পরিবর্তনের সুবিধা এখানে চালু নেই।
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    <FaCamera className="mr-2 inline text-green-700" />
                    প্রোফাইল ছবির URL
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="url"
                    defaultValue={user.image || ""}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
                </button>
              </form>
            )}

            {/* Sign Out */}
            <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  অ্যাকাউন্ট থেকে বের হবেন?
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  আপনার অ্যাকাউন্ট থেকে Sign out করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <FaSignOutAlt />
                Sign out
              </button>
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-gray-400">
          বাজার দর — আপনার নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য সঙ্গী।
        </p>
      </div>
    </main>
  );
};

export default ProfilePage;