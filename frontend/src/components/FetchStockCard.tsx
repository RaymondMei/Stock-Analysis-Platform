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
		<Card className="col-span-1 col-start-1 row-span-2 p-4 grid overflow-clip">
			<CardTitle className="col-span-full">Fetch Stock Data</CardTitle>
			<form className="col-span-full grid grid-cols-6 gap-2" onSubmit={(event: React.FormEvent) => fetchStockData(event)}>
				<Input
					id="ticker"
					type="text"
					value={ticker}
					onChange={(e) => setTicker(e.target.value)}
					placeholder="Ticker Symbol"
					className="col-start-1 md:col-span-5 col-span-3"
				/>
				<Button type="submit" className="sm:col-span-1 col-span-3 min-w-16">Search</Button>
			</form>
		</Card>
	);
};

export default FetchStockCard;
