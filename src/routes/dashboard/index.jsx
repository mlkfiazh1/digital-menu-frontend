import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/Button";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryClient";
import { fetchBusinesses } from "../../api/business";
import { selectAuth } from "../../store/authSlice";
import { useSelector } from "react-redux";
import { QrShare } from "../../components/QrShare";

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: ({ context }) => {
    if (!context.store.getState().auth.token) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const [activeSlug, setActiveSlug] = useState(null);
  const { token, user } = useSelector(selectAuth);

  const businessesQuery = useQuery({
    queryKey: queryKeys.businesses,
    queryFn: () => fetchBusinesses(token),
    enabled: Boolean(token),
  });

  const businesses = businessesQuery.data?.data ?? [];
  const selected =
    businesses.find((item) => item.slug === activeSlug) ?? businesses[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Owner workspace</p>
          <h1 className="font-display text-4xl">Hello</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/dashboard/businesses/new">
            <Button variant="secondary">Add business</Button>
          </Link>
          <Link to="/dashboard/products/new">
            <Button>Add product</Button>
          </Link>
        </div>
      </div>

      {businesses.length > 0 ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-4">
            {businesses.map((business) => (
              <article
                key={business.id}
                className={`rounded-2xl border bg-paper p-5 transition ${
                  selected?.id === business.id
                    ? "border-ember shadow-sm"
                    : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl">{business.name}</h2>
                    <p className="mt-1 text-sm text-muted">/{business.slug}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-cream"
                      onClick={() => setActiveSlug(business.slug)}
                    >
                      QR & link
                    </button>
                    <Link
                      to="/menu/$slug"
                      params={{ slug: business.slug }}
                      className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-cream"
                    >
                      View menu
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {selected ? (
            <QrShare slug={selected.slug} name={selected.name} />
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
