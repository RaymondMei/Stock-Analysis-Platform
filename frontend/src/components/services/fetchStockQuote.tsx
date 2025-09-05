import { StockQuote } from "@/App";

interface StockQuoteResponse {
	symbol: string;
	name: string;
	price: number;
	change: number;
	percent_change: number;
	volume: number;
	marketCap: number;
	time: string;
}

const mapToStockQuote = (apiResponse: StockQuoteResponse): StockQuote => {
	return {
		symbol: apiResponse.symbol,
		name: apiResponse.name,
		price: apiResponse.price,
		change: apiResponse.change,
		changePercent: apiResponse.percent_change,
		volume: apiResponse.volume,
		marketCap: apiResponse.marketCap,
	};
};

const fetchStockQuote = async (query: string): Promise<StockQuote> => {
	try {
		const response = await fetch(
			`http://localhost:8000/stockquote?query=${encodeURIComponent(query)}`
		);
		const data = await response.json();

		if ("error" in data) {
			throw new Error(data.error);
		}
		return mapToStockQuote(data.quote);
	} catch (error) {
		console.error("Error searching stocks:", error);
		throw error;
	}
};

export default fetchStockQuote;
