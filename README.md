# Jibon Photography

A lightweight, responsive wedding photography website built with plain HTML, CSS and JavaScript. No build step or package installation is required.

## Preview locally

Open `index.html` in a current browser. For local server preview, open PowerShell in this folder and run:

```powershell
python -m http.server 8000
```

Visit `http://localhost:8000`. Stop the server with `Ctrl+C`.

## Deploy

Upload the entire `jibon-photography` folder to any static web host, such as GitHub Pages, Netlify or Cloudflare Pages. Set the published directory to the project root. There are no server-side dependencies. For a custom domain, point its DNS to your hosting provider and enable HTTPS in the host settings.

### Publish to Vercel

Install Node.js LTS, then open PowerShell in this project folder and run:

```powershell
npm install --global vercel
vercel login
vercel --prod
```

Sign in through Vercel's browser prompt, then follow the CLI prompts to create or link the project and publish it. Do not share deployment tokens or account credentials.

## Update the logo and photographs

- Replace `assets/images/jibon-photography-logo.jpeg` with the studio's logo file, keeping the same filename. If you choose a new filename or format, update the image references in `index.html` and the favicon link in its `<head>`.
- Replace any image in `assets/images/` with another photograph using the same filename, or copy a new image into that folder and update its entry in `content.js`.
- The homepage banner uses the supplied `assets/images/bride-garden-full.jpg` photograph. The hero and contact background photographs are set in `styles.css` (`.hero-image` and `.contact-image`).
- Gallery image names, captions and layout are managed in the `gallery` list in `content.js`. Add or remove an entry to update the portfolio.
- To show wedding film previews, put MP4 files in `assets/videos/` and add `{ "title": "Film title", "video": "film.mp4", "poster": "poster-image.jpg" }` entries to the `films` list in `content.js`. No video files were supplied with this project, so the film section currently invites visitors to ask about available films.
- Keep original image files reasonably sized for quicker mobile loading. Gallery photos load lazily.

## Add or edit wedding packages

Open `content.js` and edit the `packageCategories` list:

- Each category has an `id`, display `name`, an `available` flag, and a `packages` list.
- A package has `name`, numeric `price`, display-ready `priceLabel`, `description` and a `services` list. Optionally add an `image` filename after placing the file in `assets/images/`. Set `featured: true` to highlight a card.
- Package buttons and their WhatsApp messages are generated from these values, so the correct package name and price are filled in automatically.
- Set a category's `available` value to `true` when its package objects are ready to display. Empty or unavailable categories show a contact prompt rather than invented prices.
- Update `whatsappNumber` in the same file if the studio's WhatsApp Business number changes. Use digits only in international format, without a plus sign.
- The contact form's package choices are populated from available packages. Submitting the form opens WhatsApp with the visitor's name, event date, selected package and price in a ready-to-send message.

No website content system, build process or developer tooling is required for these updates.
