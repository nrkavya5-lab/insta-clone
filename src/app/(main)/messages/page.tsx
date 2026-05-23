"use client";

import ConversationList from "@/components/messages/ConversationList";
import Link from "next/link";

export default function MessagesPage() {
  return (
    <div
      className="flex h-[calc(100dvh-44px)] md:h-[calc(100dvh-0px)] -mx-4 md:-mx-0"
      style={{ maxWidth: "100vw", width: "100vw" }}
    >
      <div className="hidden md:flex md:w-[380px] flex-col border-r border-[var(--ig-border)] bg-[var(--ig-bg-primary)]">
        <div className="px-4 py-3.5 border-b border-[var(--ig-border)] flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold gradient-text">Messages</h1>
            <p className="text-[10px] text-[var(--ig-text-secondary)] mt-0.5">
              Chat with your friends
            </p>
          </div>
          <Link
            href="/search"
            className="p-2 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white hover:shadow-md transition-all"
            aria-label="New message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
        <ConversationList />
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-b from-[var(--ig-bg-primary)] via-[var(--ig-bg-secondary)] to-[var(--ig-bg-primary)]">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#405de6] via-[#833ab4] to-[#e1306c] flex items-center justify-center text-4xl mb-5 animate-float shadow-xl">
            💬
          </div>
          <h2 className="text-xl font-bold gradient-text">Your messages</h2>
          <p className="text-sm text-[var(--ig-text-secondary)] mt-2 leading-relaxed">
            Select a conversation or start a new one to chat with your friends
          </p>
          <Link
            href="/search"
            className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#405de6]/20 transition-all active:scale-[0.98]"
          >
            Send a message
          </Link>
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col items-center justify-center bg-gradient-to-b from-[var(--ig-bg-primary)] to-[var(--ig-bg-secondary)]">
        <div className="flex flex-col items-center text-center px-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#405de6] to-[#e1306c] flex items-center justify-center text-3xl mb-4 animate-float shadow-lg">
            ✨
          </div>
          <h2 className="text-lg font-bold gradient-text">Your messages</h2>
          <p className="text-sm text-[var(--ig-text-secondary)] mt-2">
            Select a conversation or start a new one
          </p>
          <Link
            href="/search"
            className="mt-5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#405de6] to-[#e1306c] text-white text-sm font-semibold hover:shadow-lg transition-all"
          >
            Send a message
          </Link>
        </div>
      </div>
    </div>
  );
}
