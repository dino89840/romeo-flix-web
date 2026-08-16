import Link from "next/link";
import { Search, Shield } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link href="/" aria-label="Romeo Flix home">
          <Logo />
        </Link>

        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/category/mmsub">MMSub</Link>
          <Link href="/category/nosub">NoSub</Link>
          <Link href="/category/random">Random</Link>
        </nav>

        <form action="/" className="search-form">
          <Search size={18} />
          <input name="q" placeholder="Search movies..." />
        </form>

        <Link href="/admin" className="icon-button" aria-label="Admin">
          <Shield size={19} />
        </Link>
      </div>
    </header>
  );
}
