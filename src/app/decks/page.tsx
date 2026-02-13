"use client";

import { BackToLobbyLink } from "@/components/layout/BackToLobbyLink";
import { DeckManagerView } from "@/components/deck-manager/DeckManagerView";

export default function DecksPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <BackToLobbyLink />
        </div>
        <DeckManagerView />
      </div>
    </div>
  );
}
