import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { BacktestResult } from "@/App";

export interface BacktestCardProps {
	initialInvestment: number | undefined;
	setInitialInvestment: (initialInvestment: number) => void;
	shortWindow: number | undefined;
	setShortWindow: (shortWindow: number) => void;
	longWindow: number | undefined;
	setLongWindow: (longWindow: number) => void;
	backtestResults: BacktestResult[] | undefined;
	runBacktest: () => void;
}

const BacktestCard = ({
	initialInvestment,
	setInitialInvestment,
	shortWindow,
	setShortWindow,
	longWindow,
	setLongWindow,
	backtestResults,
	runBacktest,
}: BacktestCardProps) => {
	return (
		<Card className="col-span-1 col-start-1 row-span-6 grid p-4 overflow-clip">
			<CardTitle>Backtest</CardTitle>
				<Label htmlFor="initialInvestment">Initial Investment</Label>
				<Input
					id="initialInvestment"
					type="number"
					value={initialInvestment}
					onChange={(e) => setInitialInvestment(Number(e.target.value))}
					placeholder="1000"
				/>
				<Label htmlFor="shortWindow">Short Window</Label>
				<Input
					id="shortWindow"
					type="number"
					value={shortWindow}
					onChange={(e) => setShortWindow(Number(e.target.value))}
					placeholder="5"
				/>
				<Label htmlFor="longWindow">Long Window</Label>
				<Input
					id="longWindow"
					type="number"
					value={longWindow}
					onChange={(e) => setLongWindow(Number(e.target.value))}
					placeholder="20"
				/>
				<Button onClick={runBacktest}>
					Run Backtest
				</Button>
				<div>
					{backtestResults && (
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>Portfolio Value</th>
									<th>Stock Value</th>
									<th>Cash</th>
								</tr>
							</thead>
							<tbody>
								{backtestResults.map((day, index) => (
									<tr key={index}>
										<td>{day.date}</td>
										<td>{day.portfolioValue}</td>
										<td>{day.stockValue}</td>
										<td>{day.cash}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
		</Card>
	);
};

export default BacktestCard;
