import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsconfigPaths from "vite-tsconfig-paths";
import { RemixVitePWA } from "@vite-pwa/remix";

installGlobals();

const { RemixVitePWAPlugin, RemixPWAPreset } = RemixVitePWA();
declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      presets: [RemixPWAPreset()],
    }),
    tsconfigPaths(),
    RemixVitePWAPlugin({
      mode: "development",
      base: "/",
      injectRegister: false,
      registerType: "autoUpdate",
      manifest: {
        name: "Remix PWA",
        short_name: "Remix PWA",
        theme_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        edge_side_panel: {
          preferred_width: 480,
        },
      },
      workbox: {
        globPatterns: ["**/*.{js,html,css,png,svg,ico}"],
      },
      pwaAssets: {
        config: true,
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
      },
    }),
  ],
});
