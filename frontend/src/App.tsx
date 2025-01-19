import { useState } from "react";
import "./App.css";
import FetchStockCard, {
	FetchStockCardProps,
} from "./components/FetchStockCard";
import StockTableCard, {
	StockTableCardProps,
} from "./components/StockTableCard";
import StockGraphCard from "./components/StockGraphCard";
import BacktestCard, { BacktestCardProps } from "./components/BacktestCard";

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
	date: string;
	portfolioValue: number;
	stockValue: number;
	cash: number;
}

function App() {
	const [ticker, setTicker] = useState("");
	const [stockData, setStockData] = useState<StockData | undefined>();
	const [initialInvestment, setInitialInvestment] = useState<
		number | undefined
	>();
	const [shortWindow, setShortWindow] = useState<number | undefined>();
	const [longWindow, setLongWindow] = useState<number | undefined>();
	const [backtestResults, setBacktestResults] = useState<BacktestResult[]>();

	const fetchStockData = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`http://127.0.0.1:8000/stockhistory?ticker=${ticker}`
			);
			const data = await response.json();
			if ("error" in data) {
				setStockData(undefined);
			} else {
				setStockData(data);
			}
		} catch (error) {
			setStockData(undefined);
			console.error("Error fetching stock data:", error);
		}
	};

	const runBacktest = async (event: React.FormEvent) => {
		event.preventDefault();
		console.log("Running backtest with:", {
			initialInvestment,
			shortWindow,
			longWindow,
		});
		try {
			const response = await fetch(
				// `http://127.0.0.1:8000/simplemovingaverage?ticker=AAPL&shortWindow=10&longWindow=20`
				`http://127.0.0.1:8000/simplemovingaverage?ticker=${ticker}&shortWindow=${shortWindow}&longWindow=${longWindow}`
			);
			const data = await response.json();
			if ("error" in data) {
				setBacktestResults(undefined);
			} else {
				setBacktestResults(data);
			}
		} catch (error) {
			setBacktestResults(undefined);
			console.error("Error running backtest:", error);
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

	const fetchStockCardProps: FetchStockCardProps = {
		ticker,
		setTicker,
		fetchStockData,
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

	const stockTableCardProps: StockTableCardProps = {
		stockData,
	};

	return (
		<div className="grid grid-cols-4 grid-rows-12 gap-4 min-h-screen max-h-screen p-4">
			<FetchStockCard {...fetchStockCardProps} />
			<BacktestCard {...backtestCardProps} />
			<StockGraphCard stockData={stockData} />
			<StockTableCard {...stockTableCardProps} />
		</div>
	);
}

export default App;
