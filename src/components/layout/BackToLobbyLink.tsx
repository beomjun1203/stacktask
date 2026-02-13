"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export function BackToLobbyLink() {
  return (
    <Link
      href="/"
      className="
        inline-flex items-center gap-2 rounded-lg border border-neutral-300
        bg-white px-3 py-2 text-sm font-medium text-neutral-700
        transition-colors hover:border-neutral-400 hover:bg-neutral-50
        focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
      "
    >
      <Home className="h-4 w-4" />
      메인으로
    </Link>
  );
}
