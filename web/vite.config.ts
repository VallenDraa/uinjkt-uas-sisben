// TODO: Configure PWA
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import { RemixVitePWA, RemixPWAOptions } from "@vite-pwa/remix";

// const { RemixVitePWAPlugin, RemixPWAPreset } = RemixVitePWA();

// const manifestForPlugin: RemixPWAOptions = {
//   registerType: "autoUpdate",
//   minify: true,
//   workbox: { clientsClaim: true, skipWaiting: true },
//   devOptions: { enabled: true },
//   includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
//   pwaAssets: {
//     config: true,
//   },
//   manifest: {
//     name: "SeeBaby",
//     lang: "id",
//     short_name: "SeeBaby",
//     description:
//       "no BS all-in-one solution untuk monitoring dan perawatan bayi anda.",
//     background_color: "#ffffff",
//     theme_color: "#0284c7",
//     display: "standalone",
//     scope: "/",
//     start_url: "/",
//     orientation: "portrait",
//   },
// };

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      // presets: [RemixPWAPreset],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
    // RemixVitePWAPlugin(manifestForPlugin),
  ],
});
