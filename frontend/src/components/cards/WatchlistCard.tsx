import { StockQuote } from "@/App";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { BarChart3, Plus, TrendingUp, TrendingDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface WatchlistCardProps {
	setIsAddDialogOpen: (isOpen: boolean) => void;
	watchlist: StockQuote[];
	setSelectedStock: (symbol: string) => void;
	removeFromWatchlist: (symbol: string) => void;
}

const WatchlistCard = ({
	setSelectedStock,
	watchlist,
	removeFromWatchlist,
	setIsAddDialogOpen,
}: WatchlistCardProps) => {
	return (
		<Card className="h-full">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-primary" />
							Watchlist
						</CardTitle>
						<CardDescription>Track your favorite stocks</CardDescription>
					</div>
					<Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Stock
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{watchlist.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p>Your watchlist is empty</p>
						<p className="text-sm">Add some stocks to get started</p>
					</div>
				) : (
					<div className="space-y-4">
						{watchlist.map((stock) => (
							<div
								key={stock.symbol}
								className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
								onClick={() => setSelectedStock(stock.symbol)}
							>
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div>
											<h3 className="font-semibold text-foreground">
												{stock.symbol}
											</h3>
											<p className="text-sm text-muted-foreground">
												{stock.name}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="text-right">
										<div className="text-lg font-semibold text-foreground">
											${stock.price.toFixed(2)}
										</div>
										<div className="flex items-center gap-1">
											{stock.change > 0 ? (
												<TrendingUp className="h-4 w-4 text-green-500" />
											) : (
												<TrendingDown className="h-4 w-4 text-red-500" />
											)}
											<Badge
												variant={stock.change > 0 ? "default" : "destructive"}
												className={
													stock.change > 0
														? "bg-green-500 hover:bg-green-600"
														: ""
												}
											>
												{stock.change > 0 ? "+" : ""}
												{stock.change.toFixed(2)} (
												{stock.changePercent.toFixed(2)}%)
											</Badge>
										</div>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											removeFromWatchlist(stock.symbol);
										}}
										className="opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default WatchlistCard;
