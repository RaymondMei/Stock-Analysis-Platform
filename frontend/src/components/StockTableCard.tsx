import { StockData } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ThreeDots } from "react-loader-spinner";

export interface StockTableCardProps {
	loadingStockData: boolean;
	stockData?: StockData;
}

const StockTableCard = ({
	loadingStockData,
	stockData,
}: StockTableCardProps) => {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle>Stock Data</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 overflow-y-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Open</TableHead>
							<TableHead>High</TableHead>
							<TableHead>Low</TableHead>
							<TableHead>Close</TableHead>
							<TableHead>Volume</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{stockData ? (
							Object.entries(stockData).map(([date, value]) => (
								<TableRow key={date}>
									<TableCell className="font-medium">{date}</TableCell>
									<TableCell>{value.open}</TableCell>
									<TableCell>{value.high}</TableCell>
									<TableCell>{value.low}</TableCell>
									<TableCell>{value.close}</TableCell>
									<TableCell>{value.volume}</TableCell>
								</TableRow>
							))
						) : (
							<>
								{!loadingStockData ? (
									<TableRow>
										<TableCell colSpan={6} className="justify-items-center">
											<ThreeDots
												visible={true}
												height="50"
												width="50"
												color="black"
												radius="9"
												ariaLabel="three-dots-loading"
												wrapperStyle={{}}
												wrapperClass=""
											/>
										</TableCell>
									</TableRow>
								) : (
									<TableRow>
										<TableCell colSpan={6} className="justify-items-center">
											No data available
										</TableCell>
									</TableRow>
								)}
							</>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default StockTableCard;
