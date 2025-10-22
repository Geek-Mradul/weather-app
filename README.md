# Weather App

A simple, clean, and responsive React application that fetches and displays live weather data for any city.

![image](/Screenshot.png)

---

## Core Features

- Live weather (temperature, humidity, wind, description)
- Dynamic weather icons
- 5-day forecast
- Recent searches persisted to `localStorage`
- Responsive layout and light/dark theme support
- Clear error handling for invalid requests or network errors

---

## Technologies

- React + Vite
- CSS (variables, Flexbox, Grid)
- React Icons
- OpenWeatherMap API

---

## Setup (local)

1. Clone the repository:

```bash
git clone https://github.com/Geek-Mradul/weather-app.git
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Set environment variables (create `.env` in project root):

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Vite exposes client-side env variables only if they are prefixed with `VITE_`.

4. Run the dev server:

```bash
npm run dev
```

The app will typically be available at `http://localhost:5173`.

---

## Build / Production

1. Create a production build:

```bash
npm run build
```

2. Serve the production build locally (this project includes a small Node server and `start` script):

```bash
npm start
# opens on PORT (defaults to 3000)
```

---

## Heroku deployment (generic)

This project is ready to deploy to Heroku. The repository includes a `Procfile` and a small `server.js` to serve the Vite `dist` folder. The recommended flow is:

1. Create a Heroku app (if you don't have one):

```bash
heroku create your-app-name
```

2. Push your main branch to Heroku:

```bash
git push heroku main
```

Heroku will run `npm install`, then run the `heroku-postbuild` script (if present) to build the app, and finally run the process declared in the `Procfile`.

3. Basic checks:

```bash
heroku open -a your-app-name
heroku logs --tail -a your-app-name
```

### Environment variables on Heroku

Set runtime/build-time variables (Vite client variables that start with `VITE_` must be available at build time):

```bash
heroku config:set VITE_OPENWEATHER_API_KEY=your_api_key_here -a your-app-name
```

---

## Pointing a Cloudflare-managed domain to Heroku (generic)

If you want to use a custom domain (for example `weather.example.com`), these are the generic steps you should follow:

1. Add the domain to your Heroku app:

```bash
heroku domains:add weather.example.com -a your-app-name
heroku domains -a your-app-name
```

Heroku will display a DNS target that looks like `some-identifier.herokudns.com`.

2. In Cloudflare DNS, create a CNAME record:

- Type: CNAME
- Name: the subdomain label (e.g. `weather`)
- Target: the Heroku DNS target you copied
- TTL: Auto
- Proxy status: DNS only (grey cloud)

Important: Leave Cloudflare proxy OFF for that CNAME. Heroku's managed certificates and routing require a direct DNS CNAME. If you need Cloudflare proxy features you will need an advanced setup (paid Cloudflare features or custom certs).

3. Enable Heroku ACM (Automatic Certificate Management):

```bash
heroku certs:auto:enable -a your-app-name
heroku domains:wait weather.example.com -a your-app-name
```

4. Verify DNS and SSL:

```bash
dig +short CNAME weather.example.com
curl -I https://weather.example.com
heroku logs --tail -a your-app-name
```

---

## CI / Auto-deploy (optional)

- Connect your GitHub repo to Heroku for automatic deploys, or add a GitHub Actions workflow that runs `npm run build` and deploys to Heroku.

---

## Troubleshooting

- If the domain doesn't validate, make sure Cloudflare's proxy is disabled (grey cloud) for the CNAME.
- Ensure `VITE_` environment variables required by the client are set on Heroku before the build step if they are needed at build-time.
- Use `heroku logs --tail -a your-app-name` to inspect runtime errors.

---