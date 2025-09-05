import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import FetchStockCard, {
	FetchStockCardProps,
} from "./components/FetchStockCard";
import StockTableCard, {
	StockTableCardProps,
} from "./components/StockTableCard";
import StockGraphCard, {
	StockGraphCardProps,
} from "./components/StockGraphCard";
import BacktestCard, { BacktestCardProps } from "./components/BacktestCard";
import Navbar, { NavbarProps } from "./components/Navbar";

import { Responsive, WidthProvider } from "react-grid-layout";
import WatchlistCard from "./components/cards/WatchlistCard";
import StockDetailPage, {
	StockDetailPageProps,
} from "./components/pages/StockDetailPage";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// const apiUrl = import.meta.env.VITE_REACT_APP_API_URL ?? "http://localhost:8000";
const apiUrl =
	window.location.href.substring(0, window.location.href.lastIndexOf(":")) +
	":8000";

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
	| "backtest"
	| "graph"
	| "table"
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

const defaultWidgets: Widget[] = [
	//   { id: "watchlist", type: "watchlist", title: "My Watchlist", visible: true, position: 0 },
	//   { id: "market-overview", type: "market-overview", title: "Market Overview", visible: true, position: 1 },
	//   { id: "quick-actions", type: "quick-actions", title: "Quick Actions", visible: true, position: 2 },
	//   { id: "portfolio-summary", type: "portfolio-summary", title: "Portfolio Summary", visible: true, position: 3 },
	//   { id: "top-movers", type: "top-movers", title: "Top Movers", visible: false, position: 4 },
	//   { id: "market-news", type: "market-news", title: "Market News", visible: false, position: 5 },
	//   { id: "economic-calendar", type: "economic-calendar", title: "Economic Calendar", visible: false, position: 6 },
	//   { id: "alerts", type: "alerts", title: "Price Alerts", visible: false, position: 7 },
	{
		id: "watchlist",
		type: "watchlist",
		title: "Fetch Stock Data",
		visible: true,
		position: 0,
	},
	{
		id: "backtest",
		type: "backtest",
		title: "Backtest",
		visible: true,
		position: 1,
	},
	{
		id: "graph",
		type: "graph",
		title: "Stock Graph",
		visible: true,
		position: 2,
	},
	{
		id: "table",
		type: "table",
		title: "Stock Table",
		visible: true,
		position: 3,
	},
];

const defaultLayouts: { [key: string]: Layout[] } = {
	lg: [
		{ i: "watchlist", x: 0, y: 0, w: 6, h: 12 },
		{ i: "graph", x: 6, y: 0, w: 6, h: 12 },
		{ i: "backtest", x: 0, y: 12, w: 8, h: 6 },
		{ i: "table", x: 8, y: 12, w: 4, h: 6 },
	],
	md: [
		{ i: "watchlist", x: 0, y: 0, w: 6, h: 8 },
		{ i: "backtest", x: 6, y: 0, w: 6, h: 6 },
		{ i: "graph", x: 0, y: 8, w: 8, h: 10 },
		{ i: "table", x: 8, y: 8, w: 4, h: 10 },
	],
	sm: [
		{ i: "watchlist", x: 0, y: 0, w: 12, h: 6 },
		{ i: "backtest", x: 0, y: 6, w: 12, h: 5 },
		{ i: "graph", x: 0, y: 11, w: 12, h: 10 },
		{ i: "table", x: 0, y: 21, w: 12, h: 10 },
	],
	xs: [
		{ i: "watchlist", x: 0, y: 0, w: 12, h: 5 },
		{ i: "backtest", x: 0, y: 5, w: 12, h: 5 },
		{ i: "graph", x: 0, y: 10, w: 12, h: 8 },
		{ i: "table", x: 0, y: 18, w: 12, h: 8 },
	],
};

function App() {
	const [symbol, setSymbol] = useState("");
	const [stockData, setStockData] = useState<StockData | undefined>();
	const [initialInvestment, setInitialInvestment] = useState<
		number | undefined
	>();
	const [shortWindow, setShortWindow] = useState<number | undefined>();
	const [longWindow, setLongWindow] = useState<number | undefined>();
	const [backtestResults, setBacktestResults] = useState<BacktestResult>();
	const [loadingStockData, setLoadingStockData] = useState(false);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
	const [layouts, setLayouts] = useState(defaultLayouts);
	const [isManualLayoutChange, setIsManualLayoutChange] = useState(false);
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

	const fetchStockData = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoadingStockData(true);
		try {
			const response = await fetch(
				`${apiUrl}/stockhistory?ticker=${symbol}`
				// `http://3.84.181.13:8000/stockhistory?ticker=${symbol}`
			);
			const data = await response.json();
			if ("error" in data) {
				setStockData(undefined);
				toast(`Error fetching stock data: ${data["error"]}`);
			} else {
				setStockData(data);
			}
		} catch (error) {
			setStockData(undefined);
			toast(`Error fetching stock data: ${error}`);
		}
		setLoadingStockData(false);
	};

	const runBacktest = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${apiUrl}/simplemovingaverage?ticker=${symbol}&initialInvestment=${
					initialInvestment ?? 1000
				}&shortWindow=${shortWindow ?? 10}&longWindow=${longWindow ?? 20}`
				// `http://3.84.181.13:8000/simplemovingaverage?ticker=${symbol}&initialInvestment=${
				// 	initialInvestment ?? 1000
				// }&shortWindow=${shortWindow ?? 10}&longWindow=${longWindow ?? 20}`
			);
			const data = await response.json();
			if ("error" in data) {
				setBacktestResults(undefined);
				toast(`Error running backtest: ${data["error"]}`);
			} else {
				setBacktestResults(data as BacktestResult);
			}
		} catch (error) {
			setBacktestResults(undefined);
			toast(`Error running backtest: ${error}`);
		}
	};

	// const chartData = {
	//   labels: stockData.map((data) => data.date),
	//   datasets: [
	//     {
	//       label: "Stock Price",
	//       data: stockData.map((data) => data.close),
	//       borderColor: "rgba(75,192,192,1)",
	//       fill: false,
	//     },
	//   ],
	// };

	const removeFromWatchlist = (symbol: string) => {
		setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol));
	};

	const fetchStockCardProps: FetchStockCardProps = {
		symbol,
		setSymbol,
		fetchStockData,
	};

	const watchlistCardProps = {
		setIsAddDialogOpen,
		watchlist,
		setSelectedStock,
		removeFromWatchlist,
	};

	const backtestCardProps: BacktestCardProps = {
		initialInvestment,
		setInitialInvestment,
		shortWindow,
		setShortWindow,
		longWindow,
		setLongWindow,
		backtestResults,
		runBacktest,
	};

	const stockGraphCardProps: StockGraphCardProps = {
		loadingStockData,
		stockData,
	};

	const stockTableCardProps: StockTableCardProps = {
		loadingStockData,
		stockData,
	};

	const stockDetailPageProps: StockDetailPageProps = {
		symbol: selectedStock!,
		onBack: () => setSelectedStock(null),
	};

	const getDefaultSize = () => {
		return { w: 4, h: 8 };
	};

	const onLayoutChange = (
		currentLayout: Layout[],
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
				return <WatchlistCard {...watchlistCardProps} />;
			case "backtest":
				return <BacktestCard {...backtestCardProps} />;
			case "graph":
				return <StockGraphCard {...stockGraphCardProps} />;
			case "table":
				return <StockTableCard {...stockTableCardProps} />;
		}
	};

	const navbarProps: NavbarProps = {
		widgets,
		toggleWidget,
		isAddDialogOpen,
		setIsAddDialogOpen,
		resetLayout: () => {
			console.log("Resetting layout to default");
			setLayouts(defaultLayouts);
		},
		watchlist,
		addToWatchlist: (stock: StockQuote) => {
			setWatchlist((prev) => {
				if (prev.find((s) => s.symbol === stock.symbol)) {
					toast(`${stock.symbol} is already in your watchlist`);
					return prev;
				}
				toast(`Added ${stock.symbol} to your watchlist`);
				return [...prev, stock];
			});
		},
	};

	if (selectedStock) {
		return <StockDetailPage {...stockDetailPageProps} />;
	}

	return (
		<div className="min-h-screen">
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
							className="grid-card bg-white rounded-lg shadow-md"
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
