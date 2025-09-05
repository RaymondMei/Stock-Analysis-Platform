const fetchStockResults = async (query: string) => {
	try {
		const response = await fetch(
			`http://localhost:8000/stockresults?query=${encodeURIComponent(query)}`
		);
		const data = await response.json();

		if ("error" in data) {
			throw new Error(data.error);
		}

		return data.results;
	} catch (error) {
		console.error("Error searching stocks:", error);
		throw error;
	}
};

export default fetchStockResults;
