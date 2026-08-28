import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { slugify } from "../../lib/slug";
import { createBusiness } from "../../api/business";
import { useMutation } from "@tanstack/react-query";
import { selectAuth } from "../../store/authSlice";
import { useSelector } from "react-redux";

export const Route = createFileRoute("/dashboard/businesses/new")({
  component: NewBusinessPage,
});

function NewBusinessPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const { token } = useSelector(selectAuth);

  const mutation = useMutation({
    mutationFn: () => createBusiness(token, { name, slug }),
    onSuccess: async () => {
      // await queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleNameChange(event) {
    const nextName = event.target.value;
    setName(nextName);
    if (!slugTouched) {
      setSlug(slugify(nextName));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!slug) {
      setError("Add a public URL slug for the menu.");
      return;
    }
    // navigate({ to: "/dashboard" });
    mutation.mutate();
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-4xl">Add a business</h1>
      <p className="mt-2 text-sm text-muted">
        This creates the public menu at{" "}
        <span className="font-medium text-ink">
          /menu/{slug || "your-slug"}
        </span>
        .
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6"
      >
        <Field
          id="business-name"
          label="Business name"
          required
          value={name}
          onChange={handleNameChange}
          placeholder="Harbor Table"
        />
        <Field
          id="business-slug"
          label="Menu URL slug"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(slugify(event.target.value));
          }}
          hint="Guests and QR codes use this unique URL."
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Create business
        </Button>
      </form>
    </main>
  );
}
