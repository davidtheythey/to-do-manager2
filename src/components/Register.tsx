import { useState } from "react";
import type { FormEvent } from "react";
import { getUsers, hashPassword, saveUsers } from "../storage";
import { btnPrimary, card, errorText, field, label } from "../ui";

interface Props {
  onSuccess: (email: string) => void;
  onSwitch: () => void;
}

export default function Register({ onSuccess, onSwitch }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const key = email.trim().toLowerCase();
    if (!name.trim()) return setError("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(key)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Use a password with at least 6 characters.");
    if (password !== confirm) return setError("The passwords don’t match.");

    const users = getUsers();
    if (users[key]) return setError("An account with this email already exists. Log in instead.");

    users[key] = { name: name.trim(), hash: await hashPassword(password) };
    saveUsers(users);
    onSuccess(key);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Create an account</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Sign up to start managing your tasks.</p>
      <form onSubmit={handleSubmit} noValidate className={card}>
        <div className="mb-3">
          <label htmlFor="r-name" className={label}>Name</label>
          <input id="r-name" type="text" autoComplete="name" className={field}
            value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="r-email" className={label}>Email</label>
          <input id="r-email" type="email" autoComplete="email" className={field}
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="r-pass" className={label}>
            Password <span className="font-normal text-slate-500">(at least 6 characters)</span>
          </label>
          <input id="r-pass" type="password" autoComplete="new-password" className={field}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="r-pass2" className={label}>Confirm password</label>
          <input id="r-pass2" type="password" autoComplete="new-password" className={field}
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <p role="alert" className={`mb-2 ${errorText}`}>{error}</p>
        <button type="submit" className={`${btnPrimary} w-full`}>Create account</button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already registered?{" "}
        <button onClick={onSwitch} className="font-medium text-teal-700 underline dark:text-teal-300">
          Log in
        </button>
      </p>
    </main>
  );
}