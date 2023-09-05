import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <ul>
        <li>
          <Link href="/map">Map</Link>
        </li>
        <li>
          <Link href="/list">List</Link>
        </li>
      </ul>
    </main>
  );
}
