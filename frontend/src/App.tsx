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

const testStockData: StockData = {
	"2024-10-31": {
		open: "229.3400",
		high: "229.8300",
		low: "225.3700",
		close: "225.9100",
		volume: "64370086",
	},
	"2024-10-30": {
		open: "232.6100",
		high: "233.4700",
		low: "229.5500",
		close: "230.1000",
		volume: "47070907",
	},
	"2024-10-29": {
		open: "233.1000",
		high: "234.3250",
		low: "232.3200",
		close: "233.6700",
		volume: "35417247",
	},
	"2024-10-28": {
		open: "233.3200",
		high: "234.7300",
		low: "232.5500",
		close: "233.4000",
		volume: "36087134",
	},
	"2024-10-25": {
		open: "229.7400",
		high: "233.2200",
		low: "229.5700",
		close: "231.4100",
		volume: "38802304",
	},
	"2024-10-24": {
		open: "229.9800",
		high: "230.8200",
		low: "228.4100",
		close: "230.5700",
		volume: "31109503",
	},
	"2024-10-23": {
		open: "234.0800",
		high: "235.1440",
		low: "227.7600",
		close: "230.7600",
		volume: "52286979",
	},
	"2024-10-22": {
		open: "233.8850",
		high: "236.2200",
		low: "232.6000",
		close: "235.8600",
		volume: "38846578",
	},
	"2024-10-21": {
		open: "234.4500",
		high: "236.8500",
		low: "234.4500",
		close: "236.4800",
		volume: "36254470",
	},
	"2024-10-18": {
		open: "236.1800",
		high: "236.1800",
		low: "234.0100",
		close: "235.0000",
		volume: "46431472",
	},
	"2024-10-17": {
		open: "233.4300",
		high: "233.8500",
		low: "230.5200",
		close: "232.1500",
		volume: "32993810",
	},
	"2024-10-16": {
		open: "231.6000",
		high: "232.1200",
		low: "229.8400",
		close: "231.7800",
		volume: "34082240",
	},
	"2024-10-15": {
		open: "233.6100",
		high: "237.4900",
		low: "232.3700",
		close: "233.8500",
		volume: "64751367",
	},
	"2024-10-14": {
		open: "228.7000",
		high: "231.7300",
		low: "228.6000",
		close: "231.3000",
		volume: "39882085",
	},
	"2024-10-11": {
		open: "229.3000",
		high: "229.4100",
		low: "227.3400",
		close: "227.5500",
		volume: "31759188",
	},
	"2024-10-10": {
		open: "227.7800",
		high: "229.5000",
		low: "227.1700",
		close: "229.0400",
		volume: "28183544",
	},
	"2024-10-09": {
		open: "225.2300",
		high: "229.7500",
		low: "224.8300",
		close: "229.5400",
		volume: "33591091",
	},
	"2024-10-08": {
		open: "224.3000",
		high: "225.9800",
		low: "223.2500",
		close: "225.7700",
		volume: "31855693",
	},
	"2024-10-07": {
		open: "224.5000",
		high: "225.6900",
		low: "221.3300",
		close: "221.6900",
		volume: "39505354",
	},
	"2024-10-04": {
		open: "227.9000",
		high: "228.0000",
		low: "224.1300",
		close: "226.8000",
		volume: "37345098",
	},
	"2024-10-03": {
		open: "225.1400",
		high: "226.8050",
		low: "223.3200",
		close: "225.6700",
		volume: "34044158",
	},
	"2024-10-02": {
		open: "225.8900",
		high: "227.3700",
		low: "223.0200",
		close: "226.7800",
		volume: "32880605",
	},
	"2024-10-01": {
		open: "229.5200",
		high: "229.6500",
		low: "223.7400",
		close: "226.2100",
		volume: "63285048",
	},
	"2024-09-30": {
		open: "230.0400",
		high: "233.0000",
		low: "229.6500",
		close: "233.0000",
		volume: "54793391",
	},
	"2024-09-27": {
		open: "228.4600",
		high: "229.5200",
		low: "227.3000",
		close: "227.7900",
		volume: "34025967",
	},
	"2024-09-26": {
		open: "227.3000",
		high: "228.5000",
		low: "225.4100",
		close: "227.5200",
		volume: "36636707",
	},
	"2024-09-25": {
		open: "224.9300",
		high: "227.2900",
		low: "224.0200",
		close: "226.3700",
		volume: "42308715",
	},
	"2024-09-24": {
		open: "228.6450",
		high: "229.3500",
		low: "225.7300",
		close: "227.3700",
		volume: "43556068",
	},
	"2024-09-23": {
		open: "227.3400",
		high: "229.4500",
		low: "225.8100",
		close: "226.4700",
		volume: "54146023",
	},
	"2024-09-20": {
		open: "229.9700",
		high: "233.0900",
		low: "227.6200",
		close: "228.2000",
		volume: "318679888",
	},
	"2024-09-19": {
		open: "224.9900",
		high: "229.8200",
		low: "224.6300",
		close: "228.8700",
		volume: "66781315",
	},
	"2024-09-18": {
		open: "217.5500",
		high: "222.7100",
		low: "217.5400",
		close: "220.6900",
		volume: "59894928",
	},
	"2024-09-17": {
		open: "215.7500",
		high: "216.9000",
		low: "214.5000",
		close: "216.7900",
		volume: "45519339",
	},
	"2024-09-16": {
		open: "216.5400",
		high: "217.2200",
		low: "213.9200",
		close: "216.3200",
		volume: "59357427",
	},
	"2024-09-13": {
		open: "223.5800",
		high: "224.0400",
		low: "221.9100",
		close: "222.5000",
		volume: "36766619",
	},
	"2024-09-12": {
		open: "222.5000",
		high: "223.5500",
		low: "219.8200",
		close: "222.7700",
		volume: "37498225",
	},
	"2024-09-11": {
		open: "221.4550",
		high: "223.0900",
		low: "217.8900",
		close: "222.6600",
		volume: "44587072",
	},
	"2024-09-10": {
		open: "218.9200",
		high: "221.4800",
		low: "216.7300",
		close: "220.1100",
		volume: "51591033",
	},
	"2024-09-09": {
		open: "220.8200",
		high: "221.2700",
		low: "216.7100",
		close: "220.9100",
		volume: "67179965",
	},
	"2024-09-06": {
		open: "223.9500",
		high: "225.2400",
		low: "219.7700",
		close: "220.8200",
		volume: "48423011",
	},
	"2024-09-05": {
		open: "221.6250",
		high: "225.4800",
		low: "221.5200",
		close: "222.3800",
		volume: "36615398",
	},
	"2024-09-04": {
		open: "221.6600",
		high: "221.7800",
		low: "217.4800",
		close: "220.8500",
		volume: "43262758",
	},
	"2024-09-03": {
		open: "228.5500",
		high: "229.0000",
		low: "221.1700",
		close: "222.7700",
		volume: "50190574",
	},
	"2024-08-30": {
		open: "230.1900",
		high: "230.4000",
		low: "227.4800",
		close: "229.0000",
		volume: "52990770",
	},
	"2024-08-29": {
		open: "230.1000",
		high: "232.9200",
		low: "228.8800",
		close: "229.7900",
		volume: "51906297",
	},
	"2024-08-28": {
		open: "227.9200",
		high: "229.8600",
		low: "225.6800",
		close: "226.4900",
		volume: "38052167",
	},
	"2024-08-27": {
		open: "225.9950",
		high: "228.8500",
		low: "224.8900",
		close: "228.0300",
		volume: "35934559",
	},
	"2024-08-26": {
		open: "226.7600",
		high: "227.2800",
		low: "223.8905",
		close: "227.1800",
		volume: "30602208",
	},
	"2024-08-23": {
		open: "225.6589",
		high: "228.2200",
		low: "224.3300",
		close: "226.8400",
		volume: "38677250",
	},
	"2024-08-22": {
		open: "227.7900",
		high: "228.3400",
		low: "223.9000",
		close: "224.5300",
		volume: "43695321",
	},
	"2024-08-21": {
		open: "226.5200",
		high: "227.9800",
		low: "225.0500",
		close: "226.4000",
		volume: "34765480",
	},
	"2024-08-20": {
		open: "225.7700",
		high: "227.1700",
		low: "225.4500",
		close: "226.5100",
		volume: "30299033",
	},
	"2024-08-19": {
		open: "225.7200",
		high: "225.9900",
		low: "223.0400",
		close: "225.8900",
		volume: "40687813",
	},
	"2024-08-16": {
		open: "223.9200",
		high: "226.8271",
		low: "223.6501",
		close: "226.0500",
		volume: "44340240",
	},
	"2024-08-15": {
		open: "224.6000",
		high: "225.3500",
		low: "222.7600",
		close: "224.7200",
		volume: "46414013",
	},
	"2024-08-14": {
		open: "220.5700",
		high: "223.0300",
		low: "219.7000",
		close: "221.7200",
		volume: "41960574",
	},
	"2024-08-13": {
		open: "219.0100",
		high: "221.8900",
		low: "219.0100",
		close: "221.2700",
		volume: "44155331",
	},
	"2024-08-12": {
		open: "216.0700",
		high: "219.5099",
		low: "215.6000",
		close: "217.5300",
		volume: "38028092",
	},
	"2024-08-09": {
		open: "212.1000",
		high: "216.7800",
		low: "211.9700",
		close: "216.2400",
		volume: "42201646",
	},
	"2024-08-08": {
		open: "213.1100",
		high: "214.2000",
		low: "208.8300",
		close: "213.3100",
		volume: "47161149",
	},
	"2024-08-07": {
		open: "206.9000",
		high: "213.6400",
		low: "206.3900",
		close: "209.8200",
		volume: "63516417",
	},
	"2024-08-06": {
		open: "205.3000",
		high: "209.9900",
		low: "201.0700",
		close: "207.2300",
		volume: "69660488",
	},
	"2024-08-05": {
		open: "199.0900",
		high: "213.5000",
		low: "196.0000",
		close: "209.2700",
		volume: "119548589",
	},
	"2024-08-02": {
		open: "219.1500",
		high: "225.6000",
		low: "217.7100",
		close: "219.8600",
		volume: "105568560",
	},
	"2024-08-01": {
		open: "224.3700",
		high: "224.4800",
		low: "217.0200",
		close: "218.3600",
		volume: "62500996",
	},
	"2024-07-31": {
		open: "221.4400",
		high: "223.8200",
		low: "220.6300",
		close: "222.0800",
		volume: "50036262",
	},
	"2024-07-30": {
		open: "219.1900",
		high: "220.3250",
		low: "216.1200",
		close: "218.8000",
		volume: "41643840",
	},
	"2024-07-29": {
		open: "216.9600",
		high: "219.3000",
		low: "215.7500",
		close: "218.2400",
		volume: "36311778",
	},
	"2024-07-26": {
		open: "218.7000",
		high: "219.4900",
		low: "216.0100",
		close: "217.9600",
		volume: "41601345",
	},
	"2024-07-25": {
		open: "218.9300",
		high: "220.8500",
		low: "214.6200",
		close: "217.4900",
		volume: "51391199",
	},
	"2024-07-24": {
		open: "224.0000",
		high: "224.8000",
		low: "217.1300",
		close: "218.5400",
		volume: "61777576",
	},
	"2024-07-23": {
		open: "224.3650",
		high: "226.9400",
		low: "222.6800",
		close: "225.0100",
		volume: "39960260",
	},
	"2024-07-22": {
		open: "227.0100",
		high: "227.7800",
		low: "223.0900",
		close: "223.9600",
		volume: "48201835",
	},
	"2024-07-19": {
		open: "224.8200",
		high: "226.8000",
		low: "223.2750",
		close: "224.3100",
		volume: "49151453",
	},
	"2024-07-18": {
		open: "230.2800",
		high: "230.4400",
		low: "222.2700",
		close: "224.1800",
		volume: "66034585",
	},
	"2024-07-17": {
		open: "229.4500",
		high: "231.4599",
		low: "226.6400",
		close: "228.8800",
		volume: "57345884",
	},
	"2024-07-16": {
		open: "235.0000",
		high: "236.2700",
		low: "232.3300",
		close: "234.8200",
		volume: "43234278",
	},
	"2024-07-15": {
		open: "236.4800",
		high: "237.2300",
		low: "233.0900",
		close: "234.4000",
		volume: "62631252",
	},
	"2024-07-12": {
		open: "228.9200",
		high: "232.6400",
		low: "228.6800",
		close: "230.5400",
		volume: "53046527",
	},
	"2024-07-11": {
		open: "231.3900",
		high: "232.3900",
		low: "225.7700",
		close: "227.5700",
		volume: "64710617",
	},
	"2024-07-10": {
		open: "229.3000",
		high: "233.0800",
		low: "229.2500",
		close: "232.9800",
		volume: "62627687",
	},
	"2024-07-09": {
		open: "227.9300",
		high: "229.4000",
		low: "226.3721",
		close: "228.6800",
		volume: "48169822",
	},
	"2024-07-08": {
		open: "227.0900",
		high: "227.8500",
		low: "223.2500",
		close: "227.8200",
		volume: "59085861",
	},
	"2024-07-05": {
		open: "221.6500",
		high: "226.4500",
		low: "221.6500",
		close: "226.3400",
		volume: "60412408",
	},
	"2024-07-03": {
		open: "220.0000",
		high: "221.5500",
		low: "219.0300",
		close: "221.5500",
		volume: "37369801",
	},
	"2024-07-02": {
		open: "216.1500",
		high: "220.3800",
		low: "215.1000",
		close: "220.2700",
		volume: "58046178",
	},
	"2024-07-01": {
		open: "212.0900",
		high: "217.5100",
		low: "211.9200",
		close: "216.7500",
		volume: "60402929",
	},
	"2024-06-28": {
		open: "215.7700",
		high: "216.0700",
		low: "210.3000",
		close: "210.6200",
		volume: "82542718",
	},
	"2024-06-27": {
		open: "214.6900",
		high: "215.7395",
		low: "212.3500",
		close: "214.1000",
		volume: "49772707",
	},
	"2024-06-26": {
		open: "211.5000",
		high: "214.8600",
		low: "210.6400",
		close: "213.2500",
		volume: "66213186",
	},
	"2024-06-25": {
		open: "209.1500",
		high: "211.3800",
		low: "208.6100",
		close: "209.0700",
		volume: "56713868",
	},
	"2024-06-24": {
		open: "207.7200",
		high: "212.7000",
		low: "206.5900",
		close: "208.1400",
		volume: "80727006",
	},
	"2024-06-21": {
		open: "210.3900",
		high: "211.8900",
		low: "207.1100",
		close: "207.4900",
		volume: "246421353",
	},
	"2024-06-20": {
		open: "213.9300",
		high: "214.2400",
		low: "208.8500",
		close: "209.6800",
		volume: "86172451",
	},
	"2024-06-18": {
		open: "217.5900",
		high: "218.6300",
		low: "213.0000",
		close: "214.2900",
		volume: "79943254",
	},
	"2024-06-17": {
		open: "213.3700",
		high: "218.9500",
		low: "212.7200",
		close: "216.6700",
		volume: "93728300",
	},
	"2024-06-14": {
		open: "213.8500",
		high: "215.1700",
		low: "211.3000",
		close: "212.4900",
		volume: "70122748",
	},
	"2024-06-13": {
		open: "214.7400",
		high: "216.7500",
		low: "211.6000",
		close: "214.2400",
		volume: "97862729",
	},
	"2024-06-12": {
		open: "207.3700",
		high: "220.2000",
		low: "206.9000",
		close: "213.0700",
		volume: "198134293",
	},
	"2024-06-11": {
		open: "193.6500",
		high: "207.1600",
		low: "193.6300",
		close: "207.1500",
		volume: "172373296",
	},
};

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
	const [stockData, setStockData] = useState<StockData>(testStockData);
	const [initialInvestment, setInitialInvestment] = useState<
		number | undefined
	>();
	const [shortWindow, setShortWindow] = useState<number | undefined>();
	const [longWindow, setLongWindow] = useState<number | undefined>();
	const [backtestResults, setBacktestResults] = useState<BacktestResult[]>();

	const fetchStockData = async () => {
		try {
			const response = await fetch(
				`https://api.example.com/stocks?ticker=${ticker}`
			);
			const data = await response.json();
			setStockData(data);
		} catch (error) {
			console.error("Error fetching stock data:", error);
		}
	};

	const runBacktest = () => {
		// Implement backtest logic here
		setBacktestResults([]);
		console.log("Running backtest with:", {
			initialInvestment,
			shortWindow,
			longWindow,
		});
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
			{/* <Card className="col-span-1 row-span-8 grid gap-4 p-4"> */}
				{/* <CardContent> */}
					<FetchStockCard {...fetchStockCardProps} />
					<BacktestCard {...backtestCardProps} />
				{/* </CardContent> */}
			{/* </Card> */}
			<StockGraphCard stockData={testStockData} />
			<StockTableCard {...stockTableCardProps} />
		</div>
	);
}

export default App;
