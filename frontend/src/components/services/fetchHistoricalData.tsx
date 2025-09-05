import { StockHistoricalData } from "@/App";
import { StockHistoryPeriod } from "../pages/StockDetailPage";

const fetchHistoricalData = async (
	symbol: string,
	period: StockHistoryPeriod
): Promise<StockHistoricalData[]> => {
	try {
		const response = await fetch(
			`http://localhost:8000/stockhistoricaldata?symbol=${encodeURIComponent(
				symbol
			)}&period=${period}`
		);
		const data = await response.json();

		if ("error" in data) {
			throw new Error(data.error);
		}
		return data.historical_data;
	} catch (error) {
		console.error("Error searching stocks:", error);
		throw error;
	}
};

export default fetchHistoricalData;
