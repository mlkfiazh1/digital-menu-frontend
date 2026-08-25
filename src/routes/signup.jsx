import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../components/Button";
import { getPasswordIssues } from "../lib/password";
import { Field } from "../components/Field";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordIssues = getPasswordIssues(password);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (passwordIssues.length) {
      setError(`Password needs ${passwordIssues.join(", ")}.`);
      return;
    }

    navigate({ to: "/login" });
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-4xl">Open your kitchen</h1>
      <p className="mt-2 text-sm text-muted">
        Create an owner account, then publish a digital menu.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6 shadow-sm"
      >
        <Field
          id="name"
          label="Name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          hint="Use 8+ characters with upper, lower, number, and symbol."
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-ember hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
