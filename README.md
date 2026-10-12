# Project Pan — cosmetics & hygiene collection tracker

Version 1.1 (scanner update). A mobile-first, local-first PWA designed for GitHub Pages. No build tool, no account, no analytics, and **no personal collection data is included** in the repository. A first-time visitor starts with an empty inventory.

## What is included

- 220 built-in taxonomy nodes across skincare, makeup, hair, body, hygiene, fragrance, nails and tools. The three-level categories can be drilled into from the dashboard, inventory and Insights. Search for a very specific type when adding a product. Create/rename/delete custom nested categories.
- The main **+** menu offers **Scan barcode** and **Add product**, following Macro Tracker. Scanner opens the rear camera immediately when available, with native EAN/UPC detection or a ZXing fallback matching Macro Tracker. You can also scan a barcode photo or enter an EAN/UPC manually. A preview shows the database match, cached result, or "not found" status before adding. Online lookup via Open Beauty Facts (incomplete coverage; confirm all suggested details). Already-known barcodes offer **Add another unit**; lookup results are cached in the app. Product photos can be uploaded and are resized locally; downloaded database photos are cached locally on a best-effort background basis.
- Separate **product definitions** and **physical units**. Three copies of one shampoo = three units, each with its own cost, status, purchase/opening/finish dates, PAO, expiry, progress, hit-pan milestone and location. Statuses: unopened, in use, finished, decluttered, given away. Favorite and repurchase flags.
- Inventory counts and costs at every category depth; full search and status/favorite/repurchase/sort filters.
- Spending by month and category; cumulative known purchase cost of the active collection and completed empties; 6-month charts, inventory tracking trend, annual summary, net movement and estimated months of supply after enough data. Unpriced items and undated purchases remain visible as missing data.
- Five auto-updating Project Pan challenges: finish X, hit pan X, reduce stock to X, no-buy, spending cap. Optional time range, category scope and selected physical units.
- Wishlist vs replacements, including a path to add a wish directly into the collection.
- Optional monthly spending budget; light / **pure-black** dark themes; EUR and other currencies (currency setting changes display symbols only, not exchange conversion).
- IndexedDB on the device; complete JSON export / replace / timestamp-aware merge (including locally stored photos and deletion tombstones); optional fictional sample collection from Settings.
- Installable home-screen app and offline use after the first successful installation. Updates do not interrupt editing with a forced reload.

## Deploy on GitHub Pages

1. Create a **new, empty** repository, e.g. `project-pan` (public if you want free GitHub Pages). **Do not upload personal backup JSON files to the repository.**
2. Unzip the download and upload **all app files**, including the `.github/workflows/deploy.yml` file, to the repository root. Commit to the `main` branch. Keep the exact file names and directory structure.
3. In repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. The supplied workflow automatically deploys the site on push to `main`.
4. The app will be at `https://<your-username>.github.io/<repo-name>/`. Open it via HTTPS on your phone. Use the browser menu (or Settings → Install app when the install prompt is available) to add it to your home screen.
5. Open **Settings → Backup & restore** to export your data and later import it on another device. No account sync is built in. Export frequently; clearing site storage or removing the browser can erase local app data.

**Updating:** Replace the app files in your repository and commit again. Service-worker core files update in the background and are served on a future clean launch. When changing the service worker itself, increment the `CACHE` identifier to install a new generation. If the app offers an **Apply update** button in Settings, that button is the explicit action to reload into the waiting version; it never reloads in the middle of editing by itself.

## Privacy and operation

- Data lives on this **device/browser** in IndexedDB. A GitHub Pages public repo contains app code but not the inventory entered in the browser. The site's origin can store separate data for its PWA apps; this app uses its own `project-pan-data` database. Because GitHub Pages project sites share an origin under the same account, other scripts hosted by the same account may technically access origin storage. Protect your hosting account and avoid running untrusted scripts there.
- The public **Open Beauty Facts** API receives the barcode when you request an online lookup. It does not receive your collection or spending records. Database coverage, product images, category guesses and names may be incomplete or inaccurate.
- The camera needs HTTPS and permission. Native `BarcodeDetector` coverage varies. Unsupported browsers load `@zxing/browser@0.2.1` from unpkg as needed (same fallback as Macro Tracker). This fallback needs an internet connection when the library is not already available in the browser cache; do not assume it works offline. Manual barcode entry always works.
- Photos you upload are resized to small JPEGs. Photos originally linked from product databases are fetched for offline storage **after saving**, when the image host permits it. Such third-party images may otherwise require internet; they are not guaranteed to be embedded in a JSON export.
- An unknown price is **not** zero: it is shown as missing. Enter a price of `0` for something genuinely free. For *already owned* stock, a known price contributes to collection cost but not new purchase spending. Purchases are counted in monthly/yearly spending only when they have a purchase date.
- Tracking history begins as records are entered. The collection trend cannot reconstruct what you owned before using the app. Supply estimates use observed finishes and require at least two months of recorded history.
- PAO is a date calculated from the date opened and the manufacturer's period-after-opening indication; treat reminders as guidance, not a guarantee of product safety.
- Currency changes the displayed currency **symbol**, not the amounts. Use one currency for a given inventory or convert prices yourself before entering them.
- No remote notifications; expiry alerts are displayed in-app only.

## Files

`index.html`, `styles.css`, `app.mjs`, `model.mjs`, `service-worker.js`, `manifest.webmanifest`, `icon-180.png`, `icon-192.png`, `icon-512.png`, `.nojekyll` and `.github/workflows/deploy.yml`.

## Checks performed

- JavaScript syntax checks.
- Scanner flow unit checks: new barcode lookup, saved barcode duplicate detection, cached barcodes, no database match, simulated native camera detection, and simulated ZXing camera detection (all passed).
- Pure model tests for 220 category nodes, separate physical-unit pricing, spending excluding already-owned items, category rollups, challenges, expiry/PAO, timestamp-aware backup merges and deletion tombstones.
- Browser-based UI integration checks (in an inlined harness) for inventory add/quantity/edit/finish, category picker search, spending and collection insights, a finish challenge, a no-buy challenge, wishlist-to-product transfer, custom-category add/rename/delete, appearance and budget settings, backup JSON export/merge, and responsive mobile and desktop layouts.
- **Not live-device tested:** physical camera scanning, real third-party network responses, and installed-PWA update behavior. The local browser integration runner was blocked by its environment during this scanner revision; the checks above simulate these paths but do not replace a real phone test.
