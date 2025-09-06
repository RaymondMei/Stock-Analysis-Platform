"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
	AreaChart,
	ComposedChart,
	Bar,
} from "recharts";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	BarChart3,
	DollarSign,
	AlertTriangle,
	RefreshCw,
} from "lucide-react";
import fetchStockQuote from "../services/fetchStockQuote";
import fetchHistoricalData from "../services/fetchHistoricalData";
import { StockHistoricalData, StockQuote } from "@/App";

export type StockHistoryPeriod =
	| "1d"
	| "5d"
	| "1mo"
	| "3mo"
	| "6mo"
	| "1y"
	| "2y"
	| "5y"
	| "10y"
	| "ytd"
	| "max";

export interface StockDetailPageProps {
	symbol: string;
	onBack: () => void;
}

export function StockDetailPage({ symbol, onBack }: StockDetailPageProps) {
	const [stockData, setStockData] = useState<StockQuote | null>(null);
	const [historicalData, setHistoricalData] = useState<StockHistoricalData[]>(
		[]
	);
	const [selectedPeriod, setSelectedPeriod] =
		useState<StockHistoryPeriod>("1mo");
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingPeriod, setIsLoadingPeriod] = useState(false);

	// Cache for historical data to avoid refetching
	const [historicalCache, setHistoricalCache] = useState<
		Record<string, StockHistoricalData[]>
	>({});

	// Initial load - fetch both quote and default period data
	useEffect(() => {
		const fetchInitialData = async () => {
			setIsLoading(true);
			try {
				const [quote, historical] = await Promise.all([
					fetchStockQuote(symbol),
					fetchHistoricalData(symbol, selectedPeriod),
				]);
				setStockData(quote);
				setHistoricalData(historical);

				// Cache the initial historical data
				setHistoricalCache((prev) => ({
					...prev,
					[selectedPeriod]: historical,
				}));
			} catch (error) {
				console.error("Failed to fetch stock data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInitialData();
	}, [symbol]);

	// Handle period changes with caching
	useEffect(() => {
		const fetchPeriodData = async () => {
			// Check if we already have data for this period
			if (historicalCache[selectedPeriod]) {
				setHistoricalData(historicalCache[selectedPeriod]);
				return;
			}

			// Fetch new data for this period
			setIsLoadingPeriod(true);
			try {
				const historical = await fetchHistoricalData(symbol, selectedPeriod);
				setHistoricalData(historical);

				setHistoricalCache((prev) => ({
					...prev,
					[selectedPeriod]: historical,
				}));
			} catch (error) {
				console.error(`Failed to fetch ${selectedPeriod} data:`, error);
			} finally {
				setIsLoadingPeriod(false);
			}
		};

		// Only fetch if we're not in the initial loading state
		if (!isLoading) {
			fetchPeriodData();
		}
	}, [selectedPeriod, symbol, isLoading, historicalCache]);

	const formatPrice = (value: number) => `$${value.toFixed(2)}`;
	const formatVolume = (value: number) => {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toString();
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		if (selectedPeriod === "1d") {
			return date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			});
		}
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	// Custom candlestick bar component
	const CandlestickBar = (props: any) => {
		const { payload, x, y, width, height } = props;
		if (!payload) return <g />;

		const { open, close, high, low } = payload;
		const isPositive = close >= open;
		const color = isPositive ? "#10b981" : "#ef4444";

		// Calculate the chart's data range for scaling
		const dataMin = Math.min(
			...historicalData.map((d) => Math.min(d.open, d.close, d.high, d.low))
		);
		const dataMax = Math.max(
			...historicalData.map((d) => Math.max(d.open, d.close, d.high, d.low))
		);
		const range = dataMax - dataMin;

		// Calculate positions
		const yScale = (value: number) =>
			y + height - ((value - dataMin) / range) * height;

		const highY = yScale(high);
		const lowY = yScale(low);
		const openY = yScale(open);
		const closeY = yScale(close);

		const bodyTop = Math.min(openY, closeY);
		const bodyHeight = Math.abs(closeY - openY);

		const centerX = x + width / 2;
		const bodyWidth = Math.min(width * 0.8, 12);

		return (
			<g>
				{/* High-Low wick */}
				<line
					x1={centerX}
					y1={highY}
					x2={centerX}
					y2={lowY}
					stroke={color}
					strokeWidth={2}
				/>
				{/* Open-Close body */}
				<rect
					x={centerX - bodyWidth / 2}
					y={bodyTop}
					width={bodyWidth}
					height={Math.max(bodyHeight, 2)}
					fill={color}
					stroke={color}
					strokeWidth={2}
				/>
			</g>
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<BarChart3 className="h-12 w-12 mx-auto mb-4 animate-pulse text-muted-foreground" />
					<p className="text-muted-foreground">Loading chart data...</p>
				</div>
			</div>
		);
	}

	if (!stockData) {
		return (
			<div className="flex items-center justify-center h-96">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6">
						<div className="text-center space-y-4">
							<div className="flex justify-center">
								<AlertTriangle className="h-12 w-12 text-destructive" />
							</div>
							<div className="space-y-2">
								<h3 className="text-lg font-semibold text-foreground">
									Unable to Load Stock Data
								</h3>
								<p className="text-sm text-muted-foreground">
									We couldn't load data for "{symbol}". This might be due to an
									invalid symbol or network issues.
								</p>
							</div>
							<div className="flex gap-2 justify-center">
								<Button
									onClick={() => window.location.reload()}
									variant="default"
									size="sm"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Try Again
								</Button>
								<Button onClick={onBack} variant="outline" size="sm">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Go Back
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isPositive = stockData.change >= 0;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" onClick={onBack}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Watchlist
				</Button>
			</div>

			{/* Stock Info */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl">{stockData.symbol}</CardTitle>
							<CardDescription className="text-lg">
								{stockData.name}
							</CardDescription>
						</div>
						<div className="text-right">
							<div className="text-3xl font-bold text-foreground">
								{formatPrice(stockData.price)}
							</div>
							<div className="flex items-center gap-2 justify-end">
								{isPositive ? (
									<TrendingUp className="h-5 w-5 text-green-500" />
								) : (
									<TrendingDown className="h-5 w-5 text-red-500" />
								)}
								<Badge
									variant={isPositive ? "default" : "destructive"}
									className={
										isPositive ? "bg-green-500 hover:bg-green-600" : ""
									}
								>
									{isPositive ? "+" : ""}
									{stockData.change.toFixed(2)} (
									{stockData.changePercent.toFixed(2)}%)
								</Badge>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="flex items-center gap-2">
							<DollarSign className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="text-sm text-muted-foreground">Market Cap</p>
								<p className="font-semibold">
									{stockData.marketCap
										? `$${(stockData.marketCap / 1000000000).toFixed(1)}B`
										: "N/A"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<div>
								<p className="text-sm text-muted-foreground">Volume</p>
								<p className="font-semibold">
									{formatVolume(stockData.volume)}
								</p>
							</div>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Day High</p>
							<p className="font-semibold">
								{historicalData.length > 0
									? formatPrice(Math.max(...historicalData.map((d) => d.high)))
									: "N/A"}
							</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Day Low</p>
							<p className="font-semibold">
								{historicalData.length > 0
									? formatPrice(Math.min(...historicalData.map((d) => d.low)))
									: "N/A"}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Chart */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Price Chart</CardTitle>
						<div className="flex gap-1">
							{(
								["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y"] as const
							).map((period) => (
								<Button
									key={period}
									variant={selectedPeriod === period ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedPeriod(period)}
								>
									{period}
								</Button>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="line" className="space-y-4">
						<TabsList>
							<TabsTrigger value="line">Line Chart</TabsTrigger>
							<TabsTrigger value="area">Area Chart</TabsTrigger>
							<TabsTrigger value="candlestick">Candlestick</TabsTrigger>
						</TabsList>

						{isLoadingPeriod && (
							<div className="flex items-center justify-center py-4">
								<div className="text-sm text-muted-foreground">
									Loading {selectedPeriod} data...
								</div>
							</div>
						)}

						<TabsContent value="line" className="space-y-4">
							<div className="h-96">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={historicalData}>
										<CartesianGrid
											strokeDasharray="3 3"
											className="opacity-30"
										/>
										<XAxis
											dataKey="date"
											tickFormatter={formatDate}
											className="text-xs"
										/>
										<YAxis
											tickFormatter={formatPrice}
											className="text-xs"
											domain={["dataMin - 5", "dataMax + 5"]}
										/>
										<Tooltip
											labelFormatter={(label) =>
												`Date: ${new Date(label).toLocaleDateString()}`
											}
											formatter={(value: number) => [
												formatPrice(value),
												"Price",
											]}
											contentStyle={{
												backgroundColor: "hsl(var(--card))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
										<Line
											type="monotone"
											dataKey="close"
											stroke="#3b82f6"
											strokeWidth={3}
											dot={false}
											activeDot={{ r: 6, fill: "#3b82f6" }}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</TabsContent>

						<TabsContent value="area" className="space-y-4">
							<div className="h-96">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={historicalData}>
										<CartesianGrid
											strokeDasharray="3 3"
											className="opacity-30"
										/>
										<XAxis
											dataKey="date"
											tickFormatter={formatDate}
											className="text-xs"
										/>
										<YAxis
											tickFormatter={formatPrice}
											className="text-xs"
											domain={["dataMin - 5", "dataMax + 5"]}
										/>
										<Tooltip
											labelFormatter={(label) =>
												`Date: ${new Date(label).toLocaleDateString()}`
											}
											formatter={(value: number) => [
												formatPrice(value),
												"Price",
											]}
											contentStyle={{
												backgroundColor: "hsl(var(--card))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
										<Area
											type="monotone"
											dataKey="close"
											stroke="hsl(var(--primary))"
											fill="hsl(var(--primary))"
											fillOpacity={0.2}
											strokeWidth={2}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</TabsContent>

						<TabsContent value="candlestick" className="space-y-4">
							<div className="h-96">
								<ResponsiveContainer width="100%" height="100%">
									<ComposedChart data={historicalData}>
										<CartesianGrid
											strokeDasharray="3 3"
											className="opacity-30"
										/>
										<XAxis
											dataKey="date"
											tickFormatter={formatDate}
											className="text-xs"
										/>
										<YAxis
											tickFormatter={formatPrice}
											className="text-xs"
											domain={["dataMin - 5", "dataMax + 5"]}
										/>
										<Tooltip
											content={({ active, payload, label }) => {
												if (active && payload && payload[0] && label) {
													const data = payload[0].payload;
													return (
														<div className="bg-card border border-border rounded-lg p-3 shadow-lg">
															<p className="text-sm font-medium mb-2">
																{new Date(label as string).toLocaleDateString()}
															</p>
															<div className="space-y-1 text-xs">
																<div className="flex justify-between gap-4">
																	<span className="text-muted-foreground">
																		Open:
																	</span>
																	<span className="font-medium">
																		{formatPrice(data.open)}
																	</span>
																</div>
																<div className="flex justify-between gap-4">
																	<span className="text-muted-foreground">
																		High:
																	</span>
																	<span className="font-medium text-green-600">
																		{formatPrice(data.high)}
																	</span>
																</div>
																<div className="flex justify-between gap-4">
																	<span className="text-muted-foreground">
																		Low:
																	</span>
																	<span className="font-medium text-red-600">
																		{formatPrice(data.low)}
																	</span>
																</div>
																<div className="flex justify-between gap-4">
																	<span className="text-muted-foreground">
																		Close:
																	</span>
																	<span className="font-medium">
																		{formatPrice(data.close)}
																	</span>
																</div>
																<div className="flex justify-between gap-4">
																	<span className="text-muted-foreground">
																		Volume:
																	</span>
																	<span className="font-medium">
																		{formatVolume(data.volume)}
																	</span>
																</div>
															</div>
														</div>
													);
												}
												return null;
											}}
										/>
										<Bar
											dataKey="close"
											shape={CandlestickBar}
											fill="transparent"
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}

export default StockDetailPage;
