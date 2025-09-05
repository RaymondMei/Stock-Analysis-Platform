"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Play,
	RotateCcw,
	DollarSign,
	Percent,
} from "lucide-react";
import fetchHistoricalData from "../services/fetchHistoricalData";
import { StockHistoryPeriod } from "../pages/StockDetailPage";
import { toast } from "sonner";
import { StockHistoricalData } from "@/App";

export interface BacktestCardProps {
	onBack: () => void;
}

interface BacktestResult {
	date: string;
	portfolioValue: number;
	returns: number;
	cumulativeReturns: number;
	drawdown: number;
	position: number;
}

interface BacktestMetrics {
	totalReturn: number;
	annualizedReturn: number;
	volatility: number;
	sharpeRatio: number;
	maxDrawdown: number;
	winRate: number;
	totalTrades: number;
}

const BacktestCard = ({ onBack }: BacktestCardProps) => {
	const [symbol, setSymbol] = useState("AAPL");
	const [strategy, setStrategy] = useState("sma_crossover");
	const [initialCapital, setInitialCapital] = useState("10000");
	const [period, setPeriod] = useState<StockHistoryPeriod>("1y");
	const [shortMA, setShortMA] = useState("20");
	const [longMA, setLongMA] = useState("50");
	const [isRunning, setIsRunning] = useState(false);
	const [results, setResults] = useState<BacktestResult[]>([]);
	const [metrics, setMetrics] = useState<BacktestMetrics | null>(null);

	const runBacktest = async () => {
		if (!symbol || !initialCapital) {
			toast("Missing Parameters. Please fill in all required fields.");
			return;
		}

		setIsRunning(true);
		try {
			const historicalData = await fetchHistoricalData(symbol, period);
			const backtestResults = performBacktest(historicalData, strategy, {
				initialCapital: Number.parseFloat(initialCapital),
				shortMA: Number.parseInt(shortMA),
				longMA: Number.parseInt(longMA),
			});

			setResults(backtestResults.results);
			setMetrics(backtestResults.metrics);
			toast(
				`Backtest Complete: Strategy tested on ${historicalData.length} days of data.`
			);
		} catch (error) {
			toast(`Backtest Failed: ${error}`);
		} finally {
			setIsRunning(false);
		}
	};

	const performBacktest = (
		data: StockHistoricalData[],
		strategyType: string,
		params: { initialCapital: number; shortMA: number; longMA: number }
	) => {
		const results: BacktestResult[] = [];
		let cash = params.initialCapital;
		let shares = 0;
		let portfolioValue = params.initialCapital;
		let maxPortfolioValue = params.initialCapital;
		let trades = 0;
		let winningTrades = 0;
		let lastTradePrice = 0;

		// Calculate moving averages
		const prices = data.map((d) => d.close);
		const shortMAValues = calculateSMA(prices, params.shortMA);
		const longMAValues = calculateSMA(prices, params.longMA);

		for (let i = 0; i < data.length; i++) {
			const price = data[i].close;
			const shortMA = shortMAValues[i];
			const longMA = longMAValues[i];

			let position = shares > 0 ? 1 : 0;

			// Simple Moving Average Crossover Strategy
			if (strategyType === "sma_crossover" && i > 0) {
				const prevShortMA = shortMAValues[i - 1];
				const prevLongMA = longMAValues[i - 1];

				// Buy signal: short MA crosses above long MA
				if (shortMA > longMA && prevShortMA <= prevLongMA && shares === 0) {
					shares = Math.floor(cash / price);
					cash = cash - shares * price;
					position = 1;
					trades++;
					lastTradePrice = price;
				}
				// Sell signal: short MA crosses below long MA
				else if (shortMA < longMA && prevShortMA >= prevLongMA && shares > 0) {
					cash = cash + shares * price;
					if (price > lastTradePrice) winningTrades++;
					shares = 0;
					position = 0;
					trades++;
				}
			}

			portfolioValue = cash + shares * price;
			maxPortfolioValue = Math.max(maxPortfolioValue, portfolioValue);

			const returns =
				i > 0
					? (portfolioValue - results[i - 1].portfolioValue) /
					  results[i - 1].portfolioValue
					: 0;
			const cumulativeReturns =
				(portfolioValue - params.initialCapital) / params.initialCapital;
			const drawdown = (maxPortfolioValue - portfolioValue) / maxPortfolioValue;

			results.push({
				date: data[i].date,
				portfolioValue,
				returns,
				cumulativeReturns,
				drawdown,
				position,
			});
		}

		// Calculate metrics
		const totalReturn =
			(portfolioValue - params.initialCapital) / params.initialCapital;
		const dailyReturns = results.slice(1).map((r) => r.returns);
		const avgDailyReturn =
			dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
		const annualizedReturn = Math.pow(1 + avgDailyReturn, 252) - 1;
		const volatility =
			Math.sqrt(
				dailyReturns.reduce(
					(sum, r) => sum + Math.pow(r - avgDailyReturn, 2),
					0
				) / dailyReturns.length
			) * Math.sqrt(252);
		const sharpeRatio = volatility > 0 ? annualizedReturn / volatility : 0;
		const maxDrawdown = Math.max(...results.map((r) => r.drawdown));
		const winRate = trades > 0 ? winningTrades / trades : 0;

		return {
			results,
			metrics: {
				totalReturn,
				annualizedReturn,
				volatility,
				sharpeRatio,
				maxDrawdown,
				winRate,
				totalTrades: trades,
			},
		};
	};

	const calculateSMA = (prices: number[], period: number): number[] => {
		const sma: number[] = [];
		for (let i = 0; i < prices.length; i++) {
			if (i < period - 1) {
				sma.push(0);
			} else {
				const sum = prices
					.slice(i - period + 1, i + 1)
					.reduce((a, b) => a + b, 0);
				sma.push(sum / period);
			}
		}
		return sma;
	};

	const formatCurrency = (value: number) =>
		`$${value.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" onClick={onBack}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Dashboard
				</Button>
			</div>

			{/* Strategy Configuration */}
			<Card>
				<CardHeader>
					<CardTitle>Backtest Configuration</CardTitle>
					<CardDescription>
						Configure your trading strategy parameters
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label htmlFor="symbol">Stock Symbol</Label>
							<Input
								id="symbol"
								value={symbol}
								onChange={(e) => setSymbol(e.target.value.toUpperCase())}
								placeholder="AAPL"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="strategy">Strategy</Label>
							<Select value={strategy} onValueChange={setStrategy}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="sma_crossover">SMA Crossover</SelectItem>
									<SelectItem value="buy_hold">Buy & Hold</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="period">Time Period</Label>
							<Select
								value={period}
								onValueChange={(value) =>
									setPeriod(value as StockHistoryPeriod)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="6M">6 Months</SelectItem>
									<SelectItem value="1Y">1 Year</SelectItem>
									<SelectItem value="2Y">2 Years</SelectItem>
									<SelectItem value="5Y">5 Years</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="capital">Initial Capital</Label>
							<Input
								id="capital"
								value={initialCapital}
								onChange={(e) => setInitialCapital(e.target.value)}
								placeholder="10000"
								type="number"
							/>
						</div>
					</div>

					{strategy === "sma_crossover" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
							<div className="space-y-2">
								<Label htmlFor="shortMA">Short MA Period</Label>
								<Input
									id="shortMA"
									value={shortMA}
									onChange={(e) => setShortMA(e.target.value)}
									placeholder="20"
									type="number"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="longMA">Long MA Period</Label>
								<Input
									id="longMA"
									value={longMA}
									onChange={(e) => setLongMA(e.target.value)}
									placeholder="50"
									type="number"
								/>
							</div>
						</div>
					)}

					<div className="flex gap-2 mt-6">
						<Button onClick={runBacktest} disabled={isRunning}>
							{isRunning ? (
								<>
									<RotateCcw className="h-4 w-4 mr-2 animate-spin" />
									Running...
								</>
							) : (
								<>
									<Play className="h-4 w-4 mr-2" />
									Run Backtest
								</>
							)}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								setResults([]);
								setMetrics(null);
							}}
						>
							Clear Results
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			{metrics && results.length > 0 && (
				<>
					{/* Performance Metrics */}
					<Card>
						<CardHeader>
							<CardTitle>Performance Metrics</CardTitle>
							<CardDescription>
								Key performance indicators for your strategy
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="text-center p-4 rounded-lg bg-muted/50">
									<DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
									<div className="text-2xl font-bold text-foreground">
										{formatPercent(metrics.totalReturn)}
									</div>
									<div className="text-sm text-muted-foreground">
										Total Return
									</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-muted/50">
									<TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
									<div className="text-2xl font-bold text-foreground">
										{formatPercent(metrics.annualizedReturn)}
									</div>
									<div className="text-sm text-muted-foreground">
										Annualized Return
									</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-muted/50">
									<Percent className="h-6 w-6 mx-auto mb-2 text-blue-500" />
									<div className="text-2xl font-bold text-foreground">
										{metrics.sharpeRatio.toFixed(2)}
									</div>
									<div className="text-sm text-muted-foreground">
										Sharpe Ratio
									</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-muted/50">
									<TrendingDown className="h-6 w-6 mx-auto mb-2 text-red-500" />
									<div className="text-2xl font-bold text-foreground">
										{formatPercent(metrics.maxDrawdown)}
									</div>
									<div className="text-sm text-muted-foreground">
										Max Drawdown
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
								<div className="text-center">
									<div className="text-lg font-semibold">
										{formatPercent(metrics.volatility)}
									</div>
									<div className="text-sm text-muted-foreground">
										Volatility
									</div>
								</div>
								<div className="text-center">
									<div className="text-lg font-semibold">
										{formatPercent(metrics.winRate)}
									</div>
									<div className="text-sm text-muted-foreground">Win Rate</div>
								</div>
								<div className="text-center">
									<div className="text-lg font-semibold">
										{metrics.totalTrades}
									</div>
									<div className="text-sm text-muted-foreground">
										Total Trades
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Charts */}
					<Card>
						<CardHeader>
							<CardTitle>Backtest Results</CardTitle>
							<CardDescription>Portfolio performance over time</CardDescription>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="portfolio" className="space-y-4">
								<TabsList>
									<TabsTrigger value="portfolio">Portfolio Value</TabsTrigger>
									<TabsTrigger value="returns">Cumulative Returns</TabsTrigger>
									<TabsTrigger value="drawdown">Drawdown</TabsTrigger>
								</TabsList>

								<TabsContent value="portfolio" className="space-y-4">
									<div className="h-96">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={results}>
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
													tickFormatter={(value) => formatCurrency(value)}
													className="text-xs"
												/>
												<Tooltip
													labelFormatter={(label) =>
														`Date: ${new Date(label).toLocaleDateString()}`
													}
													formatter={(value: number) => [
														formatCurrency(value),
														"Portfolio Value",
													]}
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
												/>
												<Line
													type="monotone"
													dataKey="portfolioValue"
													stroke="hsl(var(--primary))"
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</TabsContent>

								<TabsContent value="returns" className="space-y-4">
									<div className="h-96">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={results}>
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
													tickFormatter={formatPercent}
													className="text-xs"
												/>
												<Tooltip
													labelFormatter={(label) =>
														`Date: ${new Date(label).toLocaleDateString()}`
													}
													formatter={(value: number) => [
														formatPercent(value),
														"Cumulative Returns",
													]}
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
												/>
												<Line
													type="monotone"
													dataKey="cumulativeReturns"
													stroke="hsl(var(--chart-2))"
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</TabsContent>

								<TabsContent value="drawdown" className="space-y-4">
									<div className="h-96">
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={results}>
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
													tickFormatter={formatPercent}
													className="text-xs"
												/>
												<Tooltip
													labelFormatter={(label) =>
														`Date: ${new Date(label).toLocaleDateString()}`
													}
													formatter={(value: number) => [
														formatPercent(value),
														"Drawdown",
													]}
													contentStyle={{
														backgroundColor: "hsl(var(--card))",
														border: "1px solid hsl(var(--border))",
														borderRadius: "8px",
													}}
												/>
												<Line
													type="monotone"
													dataKey="drawdown"
													stroke="hsl(var(--destructive))"
													strokeWidth={2}
													dot={false}
												/>
											</LineChart>
										</ResponsiveContainer>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
};

export default BacktestCard;
