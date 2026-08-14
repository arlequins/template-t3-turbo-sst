import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>This page is not in the journal.</h1>
      <Link href="/en/">Return home</Link>
    </main>
  );
}
