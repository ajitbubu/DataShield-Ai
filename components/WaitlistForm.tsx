"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/button";

type FormState = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setState("error");
      setMessage("Please enter a valid work email.");
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string };

      if (!response.ok) {
        setState("error");
        setMessage(payload.error ?? payload.message ?? "Unable to join waitlist. Please try again.");
        return;
      }

      if (!payload.ok) {
        setState("error");
        setMessage(payload.error ?? "Unable to join waitlist. Please try again.");
        return;
      }

      setState("success");
      setMessage(payload.message ?? "You are on the waitlist. We will notify you before launch.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error. Please try again in a moment.");
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="waitlist-email">
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          autoComplete="email"
          className="h-12 flex-1 rounded-xl border border-[#c8d4f2] bg-white/90 px-4 text-sm text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-highlight/30"
          id="waitlist-email"
          inputMode="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Work email address"
          required
          type="email"
          value={email}
        />
        <Button className="h-12 whitespace-nowrap px-6" type="submit">
          {state === "submitting" ? "Joining..." : "Join the Waitlist"}
        </Button>
      </div>
      {message ? (
        <p className={`text-sm ${state === "success" ? "text-success" : "text-danger"}`} role="status">
          {message}
        </p>
      ) : null}
      <p className="text-xs text-[#c9d7f8]">No spam. Your email stays private.</p>
    </form>
  );
}
