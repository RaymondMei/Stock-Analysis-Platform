import { TrendingUp } from "lucide-react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TopMoversCard = () => {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TrendingUp className="h-5 w-5 text-primary" />
					Top Movers
				</CardTitle>
				<CardDescription>Biggest gainers and losers</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-green-500">Top Gainers</h4>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>NVDA</span>
							<Badge className="bg-green-500 hover:bg-green-600">+8.45%</Badge>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span>AMD</span>
							<Badge className="bg-green-500 hover:bg-green-600">+6.23%</Badge>
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<h4 className="text-sm font-medium text-red-500">Top Losers</h4>
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span>META</span>
							<Badge variant="destructive">-4.12%</Badge>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span>NFLX</span>
							<Badge variant="destructive">-3.87%</Badge>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default TopMoversCard;
