import { Navigation } from "@/components/Navigation";
import { FC } from "react";

const EnvOrNo: FC<{ envVar: string }> = ({ envVar }) => (
  <p>
    {envVar}: {process.env[envVar] ?? "Missing"}{" "}
  </p>
);

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="p-4">
        <EnvOrNo envVar="VERCEL_URL" />
        <EnvOrNo envVar="NEXT_PUBLIC_VERCEL_URL" />
      </main>
    </>
  );
}
