import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Field } from "../../components/Field";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, queryKeys } from "../../lib/queryClient";
import { fetchBusinesses } from "../../api/business";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import { createProduct } from "../../api/products";

export const Route = createFileRoute("/dashboard/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const { token } = useSelector(selectAuth);

  const businessesQuery = useQuery({
    queryKey: queryKeys.businesses,
    queryFn: () => fetchBusinesses(token),
    enabled: Boolean(token),
  });

  const businesses = businessesQuery?.data?.data ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      createProduct(token, {
        name,
        price: price,
        businessId,
        file,
      }),
    onSuccess: async () => {
      const business = businesses.find((item) => item.id === businessId);
      await queryClient.invalidateQueries({ queryKey: queryKeys.businesses });
      if (business?.slug) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.menu(business.slug),
        });
        navigate({ to: "/menu/$slug", params: { slug: business.slug } });
        return;
      }
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!businessId) {
      setError("Select a business first.");
      return;
    }
    if (!file) {
      setError("Please select a product image.");
      return;
    }

    mutation.mutate();
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-4xl">Add a product</h1>
      <p className="mt-2 text-sm text-muted">
        Dishes appear on the public digital menu for the selected business.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-paper p-6"
      >
        <label className="block space-y-1.5" htmlFor="business">
          <span className="text-sm font-medium">Business</span>
          <select
            id="business"
            required
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value)}
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
          >
            <option value="">Select a business</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </label>

        <Field
          id="product-name"
          label="Dish name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Saffron risotto"
        />
        <Field
          id="product-price"
          label="Price"
          type="number"
          min="0"
          step="0.01"
          required
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <Field
          id="product-image"
          label="Photo"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          required
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          hint="PNG, JPG, or WebP. Max 5MB."
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Publish dish
        </Button>
      </form>
    </main>
  );
}
