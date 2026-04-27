"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Upload" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
        <span className="text-2xl">⚖️</span> Unbiased AI
      </Link>
      <div className="flex gap-6 text-sm font-medium">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`hover:text-indigo-200 transition-colors ${path === l.href ? "underline underline-offset-4" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
