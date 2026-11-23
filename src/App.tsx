import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { clearSession, getSession, getUsers, setSession } from "./storage";

export default function App() {
  const [email, setEmail] = useState<string | null>(() => {
    const s = getSession();
    return s && getUsers()[s] ? s : null;
  });
  const [view, setView] = useState<"login" | "register">("login");

  function handleAuth(userEmail: string) {
    setSession(userEmail);
    setEmail(userEmail);
  }

  function handleLogout() {
    clearSession();
    setEmail(null);
    setView("login");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {email ? (
        <Dashboard email={email} onLogout={handleLogout} />
      ) : view === "login" ? (
        <Login onSuccess={handleAuth} onSwitch={() => setView("register")} />
      ) : (
        <Register onSuccess={handleAuth} onSwitch={() => setView("login")} />
      )}
    </div>
  );
}