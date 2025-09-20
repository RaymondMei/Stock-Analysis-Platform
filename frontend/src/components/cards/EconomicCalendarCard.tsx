import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EconomicCalendarCard = () => {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5 text-primary" />
					Economic Calendar
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium">CPI Data</h4>
							<p className="text-xs text-muted-foreground">Today 8:30 AM</p>
						</div>
						<Badge variant="outline" className="text-xs">
							High
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium">FOMC Meeting</h4>
							<p className="text-xs text-muted-foreground">Tomorrow 2:00 PM</p>
						</div>
						<Badge variant="outline" className="text-xs">
							High
						</Badge>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-sm font-medium">GDP Report</h4>
							<p className="text-xs text-muted-foreground">Friday 8:30 AM</p>
						</div>
						<Badge variant="outline" className="text-xs">
							Medium
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default EconomicCalendarCard;
