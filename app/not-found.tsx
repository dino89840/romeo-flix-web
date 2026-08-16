import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>ဒီစာမျက်နှာ သို့မဟုတ် movie ကို မတွေ့ပါ။</p>
      <Link href="/" className="primary-action">Back Home</Link>
    </main>
  );
}
