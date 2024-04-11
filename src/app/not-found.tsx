import { Navigation } from "@/components/Navigation";
import { getDictionary } from "@/lib/dictionaries";
import Link from "next/link";

export default async function NotFound() {
  const dict = await getDictionary();
  return (
    <>
      <header className="pointer-events-none">
        <Navigation dict={dict} />
      </header>
      <main className="mx-5">
        <div className="mt-column grid grid-cols-6 gap-10">
          <div className="acan-text-intro col-span-6 sm:col-span-4">
            <h1>{dict.notFound}</h1>
          </div>
        </div>
      </main>
    </>
  );
}
