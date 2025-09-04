import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";

export interface FetchStockCardProps {
	ticker: string;
	setTicker: (ticker: string) => void;
	fetchStockData: (event: React.FormEvent) => void;
}

const FetchStockCard = ({
	ticker,
	setTicker,
	fetchStockData,
}: FetchStockCardProps) => {
	return (
		<Card className="h-full p-4 flex flex-col">
			<CardTitle className="mb-4">Fetch Stock Data</CardTitle>
			<form className="flex flex-col gap-2 flex-1" onSubmit={(event: React.FormEvent) => fetchStockData(event)}>
				<Input
					id="ticker"
					type="text"
					value={ticker}
					onChange={(e) => setTicker(e.target.value)}
					placeholder="Ticker Symbol"
					className="flex-1"
				/>
				<Button type="submit" className="w-full">Search</Button>
			</form>
		</Card>
	);
};

export default FetchStockCard;
