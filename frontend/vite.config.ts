import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Vendor chunks
					"react-vendor": ["react", "react-dom"],
					"ui-vendor": [
						"@radix-ui/react-dialog",
						"@radix-ui/react-dropdown-menu",
						"@radix-ui/react-label",
						"@radix-ui/react-scroll-area",
						"@radix-ui/react-select",
						"@radix-ui/react-slot",
						"@radix-ui/react-tabs",
					],
					"chart-vendor": [
						"lightweight-charts",
						"react-financial-charts",
						"recharts",
						"d3",
					],
					"grid-vendor": ["react-grid-layout"],
					"utils-vendor": [
						"lucide-react",
						"sonner",
						"clsx",
						"class-variance-authority",
						"tailwind-merge",
					],

					// Feature chunks
					"stock-detail": ["./src/components/pages/StockDetailPage"],
					backtest: ["./src/components/cards/BacktestCard"],
					watchlist: ["./src/components/cards/WatchlistCard"],
					"market-data": [
						"./src/components/cards/TopMoversCard",
						"./src/components/cards/MarketNewsCard",
						"./src/components/cards/EconomicCalendarCard",
					],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
