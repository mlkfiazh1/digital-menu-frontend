import {
  Link,
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../api/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.store.getState().auth.token) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (response) => {
      const data = response.data;
      if (!data?.access_token) {
        setError(response.message || "Invalid credentials");
        return;
      }

      dispatch(
        setCredentials({
          token: data.access_token,
          expiryTime: data.expiry_time,
          user: data.user,
        }),
      );

      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    // navigate({ to: "/dashboard" });
    mutation.mutate({ email, password });
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-4xl">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">
        Log in to manage businesses and dishes.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6 shadow-sm"
      >
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
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New owner?{" "}
        <Link to="/signup" className="font-semibold text-ember hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
