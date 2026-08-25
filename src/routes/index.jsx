import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/Button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(196,92,38,0.18),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(198,161,91,0.2),_transparent_36%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ember">
              Digital menus
            </p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              A beautiful menu on every table, from a link or a QR code.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted">
              Owners sign up, add a business, then publish dishes. Guests open
              the menu instantly no app, no paper, no reprinting when prices
              change.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button className="px-6 py-3">Start for free</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="px-6 py-3">
                  Owner log in
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-line bg-ink p-6 text-cream shadow-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">
                Tonight&apos;s menu
              </p>
              <h2 className="mt-2 font-display text-3xl">Harbor Table</h2>
              <ul className="mt-6 space-y-4">
                {[
                  ["Saffron risotto", 18],
                  ["Charred citrus salad", 12],
                  ["Slow lamb shoulder", 26],
                ].map(([name, price]) => (
                  <li
                    key={name}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3"
                  >
                    <span>{name}</span>
                    <span className="text-gold">${price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            [
              "1. Create an account",
              "Sign up and log in as the owner of your restaurant or cafe.",
            ],
            [
              "2. Add business & dishes",
              "Give your place a public URL, then add products with photos and prices.",
            ],
            [
              "3. Share the menu",
              "Print the QR code or send the link. Anyone can view the live digital menu.",
            ],
          ].map(([title, body]) => (
            <article
              key={title}
              className="rounded-2xl border border-line bg-cream p-6"
            >
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
