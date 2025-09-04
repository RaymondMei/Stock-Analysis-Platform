import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { BacktestResult } from "@/App";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

export interface BacktestCardProps {
	initialInvestment: number | undefined;
	setInitialInvestment: (initialInvestment: number) => void;
	shortWindow: number | undefined;
	setShortWindow: (shortWindow: number) => void;
	longWindow: number | undefined;
	setLongWindow: (longWindow: number) => void;
	backtestResults: BacktestResult | undefined;
	runBacktest: (event: React.FormEvent) => void;
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
		<Card className="h-full p-4 flex flex-col">
			<CardTitle className="mb-4">Backtest</CardTitle>
			<form
				className="flex flex-col gap-2 flex-1"
				onSubmit={(event: React.FormEvent) => runBacktest(event)}
			>
				<div className="space-y-2">
					<Label htmlFor="initialInvestment">Initial Investment</Label>
					<Input
						id="initialInvestment"
						type="number"
						value={initialInvestment}
						onChange={(e) => setInitialInvestment(Number(e.target.value))}
						placeholder="1000"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="shortWindow">Short Window</Label>
					<Input
						id="shortWindow"
						type="number"
						value={shortWindow}
						onChange={(e) => setShortWindow(Number(e.target.value))}
						placeholder="5"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="longWindow">Long Window</Label>
					<Input
						id="longWindow"
						type="number"
						value={longWindow}
						onChange={(e) => setLongWindow(Number(e.target.value))}
						placeholder="20"
					/>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button type="submit" className="mt-auto">Run Backtest</Button>
					</DialogTrigger>
					<DialogContent className="h-5/6 w-2/6 max-w-screen max-h-screen grid grid-cols-1 grid-rows-1">
						<DialogHeader>
							<DialogTitle className="pb-3">Backtest Results</DialogTitle>
							<DialogDescription className="row-span-1 overflow-y-auto">
								<div>
									{backtestResults ? (
										<Table className="overflow-clip">
											{/* <TableHeader>
										  <TableRow>
											<TableHead className="w-[100px]">Invoice</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Method</TableHead>
											<TableHead className="text-right">Amount</TableHead>
										  </TableRow>
										</TableHeader> */}
											<TableBody>
												{Object.entries(backtestResults).map(([k, v]) => (
													<TableRow>
														<TableCell>{k}</TableCell>
														<TableCell>{v}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									) : (
										<div className="flex flex-col space-y-3">
											<Skeleton className="h-[125px] w-[250px] rounded-xl" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-[250px]" />
												<Skeleton className="h-4 w-[200px]" />
											</div>
										</div>
									)}
								</div>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</form>
		</Card>
	);
};

export default BacktestCard;
