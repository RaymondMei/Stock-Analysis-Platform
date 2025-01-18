import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";

export interface FetchStockCardProps {
	ticker: string;
	setTicker: (ticker: string) => void;
	fetchStockData: () => void;
}

const FetchStockCard = ({
	ticker,
	setTicker,
	fetchStockData,
}: FetchStockCardProps) => {
	return (
		<Card className="col-span-1 col-start-1 row-span-2 p-4 grid gap-2 overflow-clip">
			<CardTitle>Fetch Stock Data</CardTitle>
			<Input
				id="ticker"
				type="text"
				value={ticker}
				onChange={(e) => setTicker(e.target.value)}
				placeholder="ticker"
			/>
			<Button onClick={fetchStockData}>Search</Button>
		</Card>
	);
};

export default FetchStockCard;
