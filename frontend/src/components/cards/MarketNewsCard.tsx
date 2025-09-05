import { Newspaper } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MarketNewsCard = () => {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Newspaper className="h-5 w-5 text-primary" />
					Market News
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-3">
					<div className="border-l-2 border-primary pl-3">
						<h4 className="text-sm font-medium">Fed Signals Rate Cut</h4>
						<p className="text-xs text-muted-foreground">2 hours ago</p>
					</div>
					<div className="border-l-2 border-muted pl-3">
						<h4 className="text-sm font-medium">
							Tech Earnings Beat Expectations
						</h4>
						<p className="text-xs text-muted-foreground">4 hours ago</p>
					</div>
					<div className="border-l-2 border-muted pl-3">
						<h4 className="text-sm font-medium">
							Oil Prices Surge on Supply Concerns
						</h4>
						<p className="text-xs text-muted-foreground">6 hours ago</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default MarketNewsCard;
