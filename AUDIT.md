# FUTO Cyber Defenders Club Website Inventory

## Architecture

- Static multi-page website built with HTML, CSS, and browser-side JavaScript.
- No in-repository backend, server, database, authentication, or Node.js build tooling.
- `Resources.json` supplies the cybersecurity resource catalog.

## Pages and functionality

| Page | Preserved functionality |
| --- | --- |
| `index.html` | Home content, navigation, resource search/catalog, roadmap toggle, external learning links, and cybersecurity news UI |
| `About.html` | Club information, mission/vision, founder details, and external resource links |
| `Contact.html` | Contact details, social links, and community links |
| `Cybersec-Podcast.html` | Cybersecurity podcast and listening-platform links |

The resource catalog and roadmap interactions use vanilla JavaScript in `main.js`. The news feed remains in `app.js` and requests news from GNews. Existing external links and data are retained.

The site links to [FabBot AI](https://fab-bot.vercel.app/Chat-room/Chat-room.html) from the navigation and home-page launcher. Chat functionality is provided by that external site; this repository contains no chatbot page, chatbot JavaScript, chat history, or AI API integration.

## Removed

- The in-site AI chatbot page, Gemini request logic, and local chat-history behavior.
- The Vite/npm package manifest, Vite configuration, installed Node modules, and generated build output.

## Run and deploy

Open `index.html` directly in a browser or deploy the static project directory to a static host such as GitHub Pages or Vercel. No package installation or build command is required.
