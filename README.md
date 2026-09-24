# Digital Menu – Frontend

React + Vite app (TanStack Router, React Query, Redux Toolkit, Tailwind CSS).

Live site: https://mlkfiazh1.github.io/digital-menu-frontend/

## Local development

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173/digital-menu-frontend/
npm run build    # production build into dist/
npm run preview  # serve the dist/ build locally
```

---

## CI/CD: deploying to GitHub Pages with GitHub Actions

Every push to `main` automatically builds the app and publishes it to GitHub Pages. No manual upload is needed.

```
git push (main) ──► GitHub Actions: build job ──► artifact (dist/) ──► deploy job ──► GitHub Pages
```

### Step 1 – Set the base path in Vite

GitHub Pages serves a project site from a sub-folder named after the repo (`/digital-menu-frontend/`), not from `/`. Vite must know this so the built HTML points to `/digital-menu-frontend/assets/...` instead of `/assets/...`.

`vite.config.js`:

```js
export default defineConfig({
  plugins: [/* ... */],
  base: "/digital-menu-frontend/", // must match the repository name
});
```

### Step 2 – Tell the router about the base path

The browser URL is `/digital-menu-frontend/...`, but routes are defined as `/`, `/dashboard`, etc. The router needs to strip the prefix before matching, otherwise no route matches and the page is blank.

`src/main.jsx`:

```js
const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL, // Vite injects the `base` value here
  context: { store, queryClient },
});
```

### Step 3 – Add the workflow file

Create `.github/workflows/deploy.yml` (the folder name and location are required; GitHub only looks there). See the line-by-line explanation below.

### Step 4 – Switch Pages to "GitHub Actions" (important)

On GitHub, open the repo and go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.

If this is left on **"Deploy from a branch"**, GitHub publishes the raw source files from `main`. The page then loads `/src/main.jsx`, which browsers can't run, and you get an **empty white page**.

### Step 5 – Push and verify

```bash
git add .
git commit -m "Set up GitHub Pages deployment"
git push origin main
```

Then:

1. Open the repo's **Actions** tab. You should see "Deploy React App to GitHub Pages" running.
2. Wait for both `build` and `deploy` jobs to turn green.
3. Click the URL shown on the `deploy` job, or open https://mlkfiazh1.github.io/digital-menu-frontend/.
4. If the page is still stale, hard-refresh (`Ctrl + Shift + R`).

---

## `deploy.yml` explained line by line

```yaml
name: Deploy React App to GitHub Pages
```
The workflow's display name in the **Actions** tab.

```yaml
on:
  push:
    branches: [main]
```
- `on:` sets the **trigger**, meaning when the workflow runs.
- `push:` runs it when commits are pushed.
- `branches: [main]` limits that to pushes to `main`. Pushes to other branches don't deploy.
- Tip: add `workflow_dispatch:` under `on:` to also get a manual **"Run workflow"** button.

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```
These set the permissions of the automatic `GITHUB_TOKEN` for this workflow (least privilege):
- `contents: read` lets the workflow read (check out) the repository code.
- `pages: write` lets it publish to GitHub Pages.
- `id-token: write` lets it request an OIDC token. `deploy-pages` uses this token to prove to GitHub Pages that the deployment really comes from this repo's workflow.

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```
- `group: pages` means runs in the same group never run at the same time.
- `cancel-in-progress: true` means that if you push again while a deploy is running, the old run is cancelled and only the newest commit is deployed.

```yaml
jobs:
```
The list of jobs. Each job runs on a fresh virtual machine, and jobs run in parallel unless linked with `needs`.

### Job 1: `build`

```yaml
  build:
    runs-on: ubuntu-latest
```
- `build:` is the job's ID (any name works).
- `runs-on: ubuntu-latest` runs it on a GitHub-hosted Linux VM with the latest Ubuntu.

```yaml
    steps:
```
The ordered list of steps in this job. `uses:` runs a prebuilt action, and `run:` runs a shell command.

```yaml
      - uses: actions/checkout@v4
```
Clones your repository into the VM. The VM starts empty, so without this step there is no code to build. `@v4` pins the action's major version.

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
```
- Installs Node.js on the VM.
- `node-version: "22"` installs the latest Node 22.x. Vite 8 needs Node 20.19+ or 22.12+, and Node 20 is end-of-life, so 22 is used.
- `cache: "npm"` caches the npm download cache, keyed on `package-lock.json`, so later runs install faster.

```yaml
      - uses: actions/configure-pages@v5
```
Prepares GitHub Pages for this repo and reads its settings (such as the site URL). It fails early with a clear error if Pages isn't enabled.

```yaml
      - run: npm ci
```
Clean install of dependencies **exactly** as listed in `package-lock.json`. It is faster and more reproducible than `npm install`, and it fails if `package.json` and the lock file disagree. This means `package-lock.json` must be committed.

```yaml
      - run: npm run build
```
Runs the `build` script from `package.json` (`vite build`). It produces the optimized static site in `dist/`: `index.html` plus hashed JS and CSS files in `dist/assets/`.

```yaml
      - run: cp dist/index.html dist/404.html
```
Makes client-side routes work on refresh and on direct links. GitHub Pages only has static files, so a URL like `/digital-menu-frontend/dashboard` has no matching file and Pages serves `404.html`. Because `404.html` is a copy of the app, React loads and TanStack Router shows the correct page.

```yaml
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```
Packages the `dist/` folder into an artifact named `github-pages`, the format Pages expects. Artifacts are how files get passed from one job to another, since each job has its own VM.

### Job 2: `deploy`

```yaml
  deploy:
    needs: build
```
- `deploy:` is the second job's ID.
- `needs: build` makes it wait until `build` succeeds. If the build fails, nothing is deployed and the live site stays as it was.

```yaml
    runs-on: ubuntu-latest
```
Runs on a fresh Linux VM.

```yaml
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
```
- `name: github-pages` links the job to the repo's `github-pages` **environment** (visible under **Settings → Environments**). That environment's protection rules apply, and the deployment history is shown on the repo home page.
- `url:` shows the live site link in the Actions UI. `${{ ... }}` is an expression that reads the `page_url` output of the step whose `id` is `deployment`.

```yaml
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
- `id: deployment` gives the step an ID so its outputs (such as `page_url`) can be referenced above.
- `actions/deploy-pages@v4` takes the `github-pages` artifact uploaded by the `build` job and publishes it live to GitHub Pages.

---

## Troubleshooting

| Problem | Cause / Fix |
| --- | --- |
| Blank white page, page source shows `/src/main.jsx` | Pages source is "Deploy from a branch". Change it to **GitHub Actions** (Step 4). |
| Blank page, JS/CSS files return 404 | `base` in `vite.config.js` doesn't match the repo name. |
| Page loads but shows "Not Found" | Router `basepath` is missing (Step 2). |
| Refreshing a sub-page gives GitHub 404 | The `404.html` copy step is missing. |
| `npm ci` fails | `package-lock.json` is missing or out of sync. Run `npm install` locally and commit the lock file. |
| Deploy job fails with a permissions error | Check the `permissions:` block, and that the `github-pages` environment allows the `main` branch. |
| API calls fail on the live site | The app is calling `localhost`. Point it to the deployed backend URL, for example through a `VITE_API_URL` env variable. |
