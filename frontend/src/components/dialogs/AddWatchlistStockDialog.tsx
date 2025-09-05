import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { StockQuote } from "@/App";
import { useState } from "react";

export interface AddWatchlistStockDialogProps {
	isAddDialogOpen: boolean;
	setIsAddDialogOpen: (isOpen: boolean) => void;
	watchlist: StockQuote[];
	addToWatchlist: (stock: StockQuote) => void;
}

const AddWatchlistStockDialog = ({
	isAddDialogOpen,
	setIsAddDialogOpen,
	watchlist,
	addToWatchlist,
}: AddWatchlistStockDialogProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<StockQuote[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	return (
		<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
			<DialogTrigger asChild>
				<div className="relative w-full max-w-sm md:max-w-md">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search stocks..."
						className="pl-10 w-full cursor-pointer text-sm md:text-base"
						readOnly
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Stock to Watchlist</DialogTitle>
					<DialogDescription>
						Search for stocks to add to your watchlist
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search stocks..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
							autoFocus
						/>
					</div>

					{isSearching && (
						<div className="flex items-center justify-center py-4">
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
						</div>
					)}

					{searchResults.length > 0 && (
						<div className="max-h-60 overflow-y-auto space-y-2">
							{searchResults.map((result) => (
								<div
									key={result.symbol}
									className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
								>
									<div>
										<div className="font-semibold text-foreground">
											{result.symbol}
										</div>
										<div className="text-sm text-muted-foreground">
											{result.name}
										</div>
									</div>
									<Button
										size="sm"
										onClick={() => addToWatchlist(result)}
										disabled={watchlist.some(
											(stock) => stock.symbol === result.symbol
										)}
									>
										{watchlist.some((stock) => stock.symbol === result.symbol)
											? "Added"
											: "Add"}
									</Button>
								</div>
							))}
						</div>
					)}

					{searchQuery.length >= 2 &&
						!isSearching &&
						searchResults.length === 0 && (
							<div className="text-center py-4 text-muted-foreground">
								No stocks found for "{searchQuery}"
							</div>
						)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddWatchlistStockDialog;
