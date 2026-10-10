
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const router = useRouter();

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("SIGNUP FORM SUBMITTED!");

  // তোমার বাকি কোড এখানে থাকবে
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      image: string;
      email: string;
      password: string;
    };

    try {
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        image: user.image || undefined,
        email: user.email,
        password: user.password,
        callbackURL: "/",
      });

   if (error) {
  console.error("SIGN UP ERROR MESSAGE:", error.message);
  console.error("SIGN UP ERROR STATUS:", error.status);
  console.error("SIGN UP ERROR CODE:", error.code);
  console.error("SIGN UP ERROR FULL:", error);

  toast.error(
    error.message || `Sign Up failed (status: ${error.status})`
  );
  return;
}

      if (data) {
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("SIGN UP ERROR:", err);
      toast.error("আবার চেষ্টা করো!");
    }
  };


  const handleGoogleSignIn = async () => {
      const data = await authClient.signIn.social({
    provider: "google",
  });
  }

  const handleGithubSignIn = async () => {
      const data = await authClient.signIn.social({
    provider: "github",
  });
  }



  return (
    <main className="min-h-[75vh] bg-[#f5faf6] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            🛒
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            বাজার দর
          </h1>

          <p className="mt-3 text-base text-gray-600">
            নতুন অ্যাকাউন্ট তৈরি করে প্রতিদিনের বাজারদর দেখুন।
          </p>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-[0_12px_40px_rgba(22,101,52,0.08)] sm:p-9">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              সাইন আপ করুন
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              নিচের তথ্যগুলো দিয়ে আপনার অ্যাকাউন্ট তৈরি করুন।
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                আপনার নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="আপনার পুরো নাম লিখুন"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                প্রোফাইল ছবির URL
                <span className="ml-2 font-normal text-gray-400">
                  (ঐচ্ছিক)
                </span>
              </label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                ইমেইল ঠিকানা
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড"
                minLength={8}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-green-700 px-5 py-4 text-base font-bold text-white shadow-md shadow-green-700/20 transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-[0.99]"
            >
              অ্যাকাউন্ট তৈরি করুন →
            </button>
          


            {/* singin with google */}


          <button onClick={handleGoogleSignIn}
            type="button"
            className="w-full  rounded-xl border border-gray-200 bg-white px-5 py-4 text-base font-bold text-gray-900 shadow-md shadow-gray-700/20 transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-[0.99]"
          >
            Google দিয়ে সাইন ইন করুন
          </button>
          <button onClick={handleGithubSignIn}
            type="button"
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-base font-bold text-gray-900 shadow-md shadow-gray-700/20 transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-200 active:scale-[0.99]"
          >
            GitHub দিয়ে সাইন ইন করুন
          </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <a
              href="/signin"
              className="font-bold text-green-700 hover:text-green-800 hover:underline"
            >
              সাইন ইন করুন
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          🥬 আপনার প্রতিদিনের বাজারদর, এখন হাতের মুঠোয়।
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
