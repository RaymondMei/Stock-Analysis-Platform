import { useState } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Stock = {
	ticker: string;
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

function App() {
	const [ticker, setTicker] = useState("");
	const [stockData, setStockData] = useState<Stock[]>([]);

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

	return (
		<div className="grid min-h-screen border-gray-300 border rounded-md p-4">
			<h1>Stock Data Fetcher</h1>
			<div className="grid w-full max-w-sm gap-1.5 border-gray-300 border rounded-md p-4">
				<Label htmlFor="ticker">Ticker</Label>
				<Input
					id="ticker"
					type="text"
					value={ticker}
					onChange={(e) => setTicker(e.target.value)}
					placeholder="AAPL"
				/>
				<Button variant="outline" onClick={fetchStockData}>
					Search
				</Button>
			</div>
			<div>
				{stockData.length > 0 && (
					<table>
						<thead>
							<tr>
								<th>Date</th>
								<th>Open</th>
								<th>High</th>
								<th>Low</th>
								<th>Close</th>
								<th>Volume</th>
							</tr>
						</thead>
						<tbody>
							{stockData.map((day, index) => (
								<tr key={index}>
									<td>{day.date}</td>
									<td>{day.open}</td>
									<td>{day.high}</td>
									<td>{day.low}</td>
									<td>{day.close}</td>
									<td>{day.volume}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}

export default App;
