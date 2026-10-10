import { Suspense } from "react";
import CategoryContent from "./CategoryContent";

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </main>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}