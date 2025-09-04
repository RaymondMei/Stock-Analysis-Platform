import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Search, Settings, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreeDots } from "react-loader-spinner";
import { Widget } from "@/App";

export interface NavbarProps {
	widgets: Widget[];
	toggleWidget: (widgetId: string) => void;
}

const Navbar = (
	{ widgets, toggleWidget }: NavbarProps
) => {
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
	const [isSearching, setIsSearching] = useState(false)
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [watchlist, setWatchlist] = useState<StockQuote[]>([
		{ symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: 2.34, changePercent: 1.35, volume: 45234567 },
		{ symbol: "GOOGL", name: "Alphabet Inc.", price: 142.56, change: -1.23, changePercent: -0.85, volume: 23456789 },
		{ symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 5.67, changePercent: 1.52, volume: 34567890 },
	]);

	const addToWatchlist = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim() && !watchlist.includes(searchInput.toUpperCase())) {
			setWatchlist([...watchlist, searchInput.toUpperCase()]);
			setSearchInput("");
		}
	};

	const removeFromWatchlist = (ticker: string) => {
		setWatchlist(watchlist.filter(item => item !== ticker));
	};

	return (
		<nav className="border-b bg-background sticky top-0 z-50">
			<div className="container flex h-16 items-center px-4 gap-2">
				{/* Logo and Title */}
				<div className="flex items-center space-x-2 flex-shrink-0">
					<TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
					<span className="font-bold text-base sm:text-lg md:text-xl truncate max-w-[120px] sm:max-w-none">
						Stock Analysis Platform
					</span>
				</div>

				{/* Search section - responsive */}
				<div className="flex-1 min-w-0 mx-2 md:mx-4">
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
                    <DialogDescription>Search for stocks to add to your watchlist</DialogDescription>
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
                              <div className="font-semibold text-foreground">{result.symbol}</div>
                              <div className="text-sm text-muted-foreground">{result.name}</div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => addToWatchlist(result)}
                              disabled={watchlist.some((stock) => stock.symbol === result.symbol)}
                            >
                              {watchlist.some((stock) => stock.symbol === result.symbol) ? "Added" : "Add"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No stocks found for "{searchQuery}"</div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
				</div>

				{/* Right section with customize button */}
				<div className="flex-shrink-0">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="text-xs md:text-sm">
							<Settings className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
							<span className="hidden sm:inline">Customize</span>
							<span className="sm:hidden">•••</span>
						</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
						{widgets.map((widget) => (
							<DropdownMenuItem
							key={widget.id}
							onClick={() => toggleWidget(widget.id)}
							className="flex items-center justify-between"
							>
							<span>{widget.title}</span>
							{widget.visible ? (
								<Eye className="h-4 w-4 text-green-500" />
							) : (
								<EyeOff className="h-4 w-4 text-muted-foreground" />
							)}
							</DropdownMenuItem>
						))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
