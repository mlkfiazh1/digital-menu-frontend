import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "../api/products";
import { Spinner } from "../components/Spinner";
import { formatPrice, mediaUrl } from "../lib/media";
import { queryKeys } from "../lib/queryClient";

export const Route = createFileRoute("/menu/$slug")({
  component: PublicMenuPage,
});

function PublicMenuPage() {
  const { slug } = Route.useParams();

  const menuQuery = useQuery({
    queryKey: queryKeys.menu(slug),
    queryFn: () => fetchMenu(slug),
  });

  const menu = menuQuery.data?.data;
  const products = menu?.products ?? [];

  if (menuQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-gold">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (menuQuery.isError || !menu) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center text-cream">
        <p className="font-display text-4xl">Menu not found</p>
        <p className="mt-3 text-sm text-white/60">
          This QR or link does not match an active business.
        </p>
        <Link to="/" className="mt-8 inline-block text-gold underline">
          Back to Digital Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(198,161,91,0.16),_transparent_34%),linear-gradient(#161210,#1c1612)] px-4 py-10 text-cream">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-gold">
          Digital menu
        </p>
        <h1 className="mt-3 text-center font-display text-5xl">{menu.name}</h1>
        <p className="mt-3 text-center text-sm text-white/55">
          Scan, tap, order from the table.
        </p>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-white/50">
            This kitchen is still plating the first dishes.
          </p>
        ) : (
          <ul className="mt-12 space-y-5">
            {products.map((product) => (
              <li
                key={product.id}
                className="grid grid-cols-[7rem_1fr] overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-[9rem_1fr]"
              >
                <div className="h-28 bg-ink-soft sm:h-32">
                  {product.image ? (
                    <img
                      src={mediaUrl(product.image)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-white/30">
                      No photo
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                  <div>
                    <h2 className="font-display text-2xl">{product.name}</h2>
                    {/* <p className="mt-1 text-sm text-white/50">House special</p> */}
                  </div>
                  <p className="shrink-0 font-semibold text-gold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
