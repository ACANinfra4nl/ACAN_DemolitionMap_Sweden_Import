import { Navigation } from "@/components/Navigation";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <header className="pointer-events-none">
        <Navigation />
      </header>
      <main className="mx-5">
        <div className="mt-column grid grid-cols-6 gap-10">
          <div className="acan-text-intro col-span-6 sm:col-span-4">
            <h1>Sidan finns inte.</h1>
          </div>
        </div>
      </main>
    </>
  );
}
