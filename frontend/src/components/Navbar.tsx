import { Button } from "@/components/ui/button";
import {
	Eye,
	EyeOff,
	Move,
	RotateCcw,
	Settings,
	Target,
	TrendingUp,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockQuote, Widget } from "@/App";
import AddWatchlistStockDialog from "./dialogs/AddWatchlistStockDialog";

export interface NavbarProps {
	widgets: Widget[];
	toggleWidget: (widgetId: string) => void;
	isAddDialogOpen: boolean;
	setIsAddDialogOpen: (isOpen: boolean) => void;
	resetLayout: () => void;
	watchlist: StockQuote[];
	addToWatchlist: (stock: StockQuote) => void;
	setShowBacktest: (show: boolean) => void;
	isDraggableMode: boolean;
	setIsDraggableMode: (isDraggable: boolean) => void;
}

const Navbar = ({
	widgets,
	toggleWidget,
	isAddDialogOpen,
	setIsAddDialogOpen,
	resetLayout,
	watchlist,
	addToWatchlist,
	setShowBacktest,
	isDraggableMode,
	setIsDraggableMode,
}: NavbarProps) => {
	return (
		<nav className="border-b bg-white sticky top-0 z-50">
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
					<AddWatchlistStockDialog
						isAddDialogOpen={isAddDialogOpen}
						setIsAddDialogOpen={setIsAddDialogOpen}
						watchlist={watchlist}
						addToWatchlist={addToWatchlist}
					/>
				</div>

				{/* Right section with reset and customize buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant={isDraggableMode ? "default" : "outline"}
						size="sm"
						className="text-xs md:text-sm"
						onClick={() => setIsDraggableMode(!isDraggableMode)}
						title={isDraggableMode ? "Disable Drag Mode" : "Enable Drag Mode"}
					>
						<Move className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
						<span className="hidden sm:inline">
							{isDraggableMode ? "Stop Drag" : "Drag"}
						</span>
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="text-xs md:text-sm"
							>
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

					<Button
						variant="outline"
						size="sm"
						className="text-xs md:text-sm"
						onClick={resetLayout}
						title="Reset Layout"
					>
						<RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
						<span className="hidden sm:inline">Reset</span>
					</Button>

					<Button
						className="w-full justify-start bg-transparent"
						variant="outline"
						onClick={() => setShowBacktest(true)}
					>
						<Target className="h-4 w-4 mr-2" />
						Run Backtest
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
