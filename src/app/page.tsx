"use client";

import Link from "next/link";
import { Play, Map, Library } from "lucide-react";

const NAV_ITEMS = [
  { href: "/playground", label: "Play Mode", icon: Play },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/decks", label: "Deck Manager", icon: Library },
] as const;

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="flex max-w-xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Life Deck Builder
          </h1>
          <p className="text-lg text-neutral-600 sm:text-xl">
            Gamify Your Life with Deck Building
          </p>
        </div>

        <nav className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="
                flex flex-col items-center gap-3 rounded-xl border border-neutral-200
                bg-white p-6 text-foreground shadow-sm
                transition-all duration-200 hover:scale-105 hover:border-neutral-300
                hover:shadow-md focus:outline-none focus:ring-2
                focus:ring-neutral-400 focus:ring-offset-2
              "
            >
              <Icon className="h-10 w-10 text-neutral-600" />
              <span className="font-semibold">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
