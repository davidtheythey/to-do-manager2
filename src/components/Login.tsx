import { useState } from "react";
import type { FormEvent } from "react";
import { getUsers, hashPassword } from "../storage";
import { btnPrimary, card, errorText, field, label } from "../ui";

interface Props {
  onSuccess: (email: string) => void;
  onSwitch: () => void;
}

export default function Login({ onSuccess, onSwitch }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const key = email.trim().toLowerCase();
    if (!key || !password) {
      setError("Enter your email and password.");
      return;
    }
    const user = getUsers()[key];
    const hash = await hashPassword(password);
    if (!user || user.hash !== hash) {
      setError("Email or password is incorrect.");
      return;
    }
    onSuccess(key);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Log in</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Welcome back. Log in to see your tasks.</p>
      <form onSubmit={handleSubmit} noValidate className={card}>
        <div className="mb-3">
          <label htmlFor="l-email" className={label}>Email</label>
          <input id="l-email" type="email" autoComplete="email" className={field}
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="l-pass" className={label}>Password</label>
          <input id="l-pass" type="password" autoComplete="current-password" className={field}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <p role="alert" className={`mb-2 ${errorText}`}>{error}</p>
        <button type="submit" className={`${btnPrimary} w-full`}>Log in</button>
      </form>
      <p className="mt-4 text-center text-sm">
        No account yet?{" "}
        <button onClick={onSwitch} className="font-medium text-teal-700 underline dark:text-teal-300">
          Create an account
        </button>
      </p>
    </main>
  );
}