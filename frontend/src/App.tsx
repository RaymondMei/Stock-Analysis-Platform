import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Navbar, { NavbarProps } from "./components/Navbar";

import { Responsive, WidthProvider } from "react-grid-layout";

// Lazy load heavy components
const WatchlistCard = lazy(() => import("./components/cards/WatchlistCard"));
const StockDetailPage = lazy(
	() => import("./components/pages/StockDetailPage")
);
const TopMoversCard = lazy(() => import("./components/cards/TopMoversCard"));
const MarketNewsCard = lazy(() => import("./components/cards/MarketNewsCard"));
const BacktestCard = lazy(() => import("./components/cards/BacktestCard"));
const EconomicCalendarCard = lazy(
	() => import("./components/cards/EconomicCalendarCard")
);

// Import types separately
import type { StockDetailPageProps } from "./components/pages/StockDetailPage";
import type { BacktestCardProps } from "./components/cards/BacktestCard";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface StockPoint {
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
}

export interface StockData {
	[date: string]: StockPoint;
}

export interface BacktestResult {
	Start: string;
	End: string;
	Duration: string;
	"Exposure Time [%]": number;
	"Equity Final [$]": number;
	"Equity Peak [$]": number;
	"Return [%]": number;
	"Buy & Hold Return [%]": number;
	"Return (Ann.) [%]": number;
	"Volatility (Ann.) [%]": number;
	"Sharpe Ratio": number;
	"Sortino Ratio": number;
	"Calmar Ratio": number;
	"Max. Drawdown [%]": number;
	"Avg. Drawdown [%]": number;
	"Max. Drawdown Duration": string;
	"Avg. Drawdown Duration": string;
	"# Trades": number;
	"Win Rate [%]": number;
	"Best Trade [%]": number;
	"Worst Trade [%]": number;
	"Avg. Trade [%]": number;
	"Max. Trade Duration": string;
	"Avg. Trade Duration": string;
	"Profit Factor": number | null;
	"Expectancy [%]": number;
	SQN: number;
	_strategy: string;
}

export type WidgetType =
	| "watchlist"
	| "market-overview"
	| "quick-actions"
	| "portfolio-summary"
	| "top-movers"
	| "market-news"
	| "economic-calendar"
	| "alerts";

export interface Widget {
	id: string;
	type: WidgetType;
	title: string;
	visible: boolean;
	position: number;
}

export interface Layout {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface StockQuote {
	symbol: string;
	name: string;
	price: number;
	change: number;
	changePercent: number;
	volume: number;
	marketCap?: number;
}

export interface StockHistoricalData {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

const defaultWidgets: Widget[] = [
	{
		id: "watchlist",
		type: "watchlist",
		title: "Fetch Stock Data",
		visible: true,
		position: 0,
	},
	{
		id: "top-movers",
		type: "top-movers",
		title: "Top Movers",
		visible: true,
		position: 1,
	},
	{
		id: "market-news",
		type: "market-news",
		title: "Market News",
		visible: true,
		position: 2,
	},
	{
		id: "economic-calendar",
		type: "economic-calendar",
		title: "Economic Calendar",
		visible: true,
		position: 3,
	},
];

const defaultLayouts: { [key: string]: Layout[] } = {
	lg: [
		{ i: "watchlist", x: 0, y: 0, w: 8, h: 14 },
		{ i: "market-news", x: 8, y: 0, w: 4, h: 6 },
		{ i: "top-movers", x: 8, y: 6, w: 2, h: 8 },
		{ i: "economic-calendar", x: 10, y: 6, w: 2, h: 8 },
	],
	md: [
		{ i: "watchlist", x: 0, y: 0, w: 6, h: 8 },
		{ i: "top-movers", x: 6, y: 0, w: 6, h: 6 },
		{ i: "market-news", x: 0, y: 8, w: 8, h: 10 },
		{ i: "economic-calendar", x: 8, y: 8, w: 4, h: 10 },
	],
	sm: [
		{ i: "watchlist", x: 0, y: 0, w: 12, h: 6 },
		{ i: "top-movers", x: 0, y: 6, w: 12, h: 5 },
		{ i: "market-news", x: 0, y: 11, w: 12, h: 10 },
		{ i: "economic-calendar", x: 0, y: 21, w: 12, h: 10 },
	],
	xs: [
		{ i: "watchlist", x: 0, y: 0, w: 12, h: 5 },
		{ i: "top-movers", x: 0, y: 5, w: 12, h: 5 },
		{ i: "market-news", x: 0, y: 10, w: 12, h: 8 },
		{ i: "economic-calendar", x: 0, y: 18, w: 12, h: 8 },
	],
};

function App() {
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
	const [layouts, setLayouts] = useState(defaultLayouts);
	const [isManualLayoutChange, setIsManualLayoutChange] = useState(false);
	const [showBacktest, setShowBacktest] = useState(false);
	const [isDraggableMode, setIsDraggableMode] = useState(false);
	const [watchlist, setWatchlist] = useState<StockQuote[]>([
		{
			symbol: "AAPL",
			name: "Apple Inc.",
			price: 175.43,
			change: 2.34,
			changePercent: 1.35,
			volume: 45234567,
		},
		{
			symbol: "GOOGL",
			name: "Alphabet Inc.",
			price: 142.56,
			change: -1.23,
			changePercent: -0.85,
			volume: 23456789,
		},
		{
			symbol: "MSFT",
			name: "Microsoft Corp.",
			price: 378.85,
			change: 5.67,
			changePercent: 1.52,
			volume: 34567890,
		},
	]);
	const [selectedStock, setSelectedStock] = useState<string | null>(null);

	const addToWatchlist = (stock: StockQuote) => {
		setWatchlist((prev) => {
			if (prev.find((s) => s.symbol === stock.symbol)) {
				toast(`${stock.symbol} is already in your watchlist`);
				return prev;
			}
			toast(`Added ${stock.symbol} to your watchlist`);
			return [...prev, stock];
		});
	};

	const removeFromWatchlist = (symbol: string) => {
		setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol));
	};

	const watchlistCardProps = {
		setIsAddDialogOpen,
		watchlist,
		setSelectedStock,
		removeFromWatchlist,
	};

	const stockDetailPageProps: StockDetailPageProps = {
		symbol: selectedStock!,
		onBack: () => setSelectedStock(null),
	};

	const getDefaultSize = () => {
		return { w: 4, h: 8 };
	};

	const onLayoutChange = (
		_currentLayout: Layout[],
		allLayouts: { [key: string]: Layout[] }
	) => {
		if (isManualLayoutChange) {
			setLayouts(layouts);
			setIsManualLayoutChange(false); // for race condition with the compacting behavior
		} else {
			setLayouts(allLayouts);
		}
	};

	const visibleWidgets = widgets
		.filter((w) => w.visible)
		.sort((a, b) => a.position - b.position);

	// Handle layout updates when widget visibility changes
	useEffect(() => {
		const visibleWidgetIds = visibleWidgets.map((w) => w.id);
		setIsManualLayoutChange(true);
		setLayouts((prevLayouts) => {
			const newLayouts = { ...prevLayouts };

			Object.keys(newLayouts).forEach((breakpoint) => {
				const currentLayout = newLayouts[breakpoint];

				// Remove layouts for invisible widgets
				const filteredLayout = currentLayout.filter((widget) =>
					visibleWidgetIds.includes(widget.i)
				);
				const filteredLayoutIds = new Set(
					filteredLayout.map((widget) => widget.i)
				);

				// Add layouts for newly visible widgets
				visibleWidgetIds.forEach((widgetId) => {
					if (!filteredLayoutIds.has(widgetId)) {
						// Create new layout at the bottom
						const maxY = filteredLayout.reduce(
							(max, item) => (item.y + item.h > max ? item.y + item.h : max),
							0
						);
						const defaultSize = getDefaultSize();
						filteredLayout.push({
							i: widgetId,
							x: 0,
							y: maxY,
							w: defaultSize.w,
							h: defaultSize.h,
						});
					}
				});

				newLayouts[breakpoint] = filteredLayout;
			});
			return newLayouts;
		});
	}, [widgets]); // React to changes in widgets array

	const toggleWidget = (widgetId: string) => {
		setWidgets((prev) =>
			prev.map((widget) => {
				if (widget.id === widgetId) {
					return { ...widget, visible: !widget.visible };
				}
				return widget;
			})
		);
	};

	const renderWidget = (widget: Widget) => {
		switch (widget.type) {
			case "watchlist":
				return (
					<Suspense fallback={<div className="p-4">Loading...</div>}>
						<WatchlistCard {...watchlistCardProps} />
					</Suspense>
				);
			case "market-news":
				return (
					<Suspense fallback={<div className="p-4">Loading...</div>}>
						<MarketNewsCard />
					</Suspense>
				);
			case "top-movers":
				return (
					<Suspense fallback={<div className="p-4">Loading...</div>}>
						<TopMoversCard />
					</Suspense>
				);
			case "economic-calendar":
				return (
					<Suspense fallback={<div className="p-4">Loading...</div>}>
						<EconomicCalendarCard />
					</Suspense>
				);
		}
	};

	const navbarProps: NavbarProps = {
		widgets,
		toggleWidget,
		isAddDialogOpen,
		setIsAddDialogOpen,
		resetLayout: () => setLayouts(defaultLayouts),
		watchlist,
		addToWatchlist,
		setShowBacktest,
		isDraggableMode,
		setIsDraggableMode,
	};

	const backtestCardProps: BacktestCardProps = {
		onBack: () => setShowBacktest(false),
	};

	if (showBacktest) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-6">
					<Suspense
						fallback={
							<div className="flex items-center justify-center h-64">
								Loading...
							</div>
						}
					>
						<BacktestCard {...backtestCardProps} />
					</Suspense>
				</div>
			</div>
		);
	}

	if (selectedStock) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-6">
					<Suspense
						fallback={
							<div className="flex items-center justify-center h-64">
								Loading...
							</div>
						}
					>
						<StockDetailPage {...stockDetailPageProps} />
					</Suspense>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			{/* <SpeedInsights /> */}
			<Navbar {...navbarProps} />
			<div className="p-4">
				<ResponsiveReactGridLayout
					className="layout"
					layouts={layouts}
					onLayoutChange={onLayoutChange}
					breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{ lg: 12, md: 4, sm: 4, xs: 2, xxs: 2 }}
					rowHeight={30}
					isDraggable={true}
					isResizable={true}
					resizeHandles={["se"]}
					margin={[16, 16]}
					verticalCompact={true}
					draggableCancel=".no-drag"
					draggableHandle=".drag-handle"
				>
					{visibleWidgets.map((widget) => (
						<div
							key={widget.id}
							className={`grid-card bg-white rounded-lg shadow-md ${
								isDraggableMode ? "drag-handle" : ""
							}`}
						>
							{renderWidget(widget)}
						</div>
					))}
				</ResponsiveReactGridLayout>
			</div>
			<Toaster />
		</div>
	);
}

export default App;
