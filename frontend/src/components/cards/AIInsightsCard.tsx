// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
// import { useState } from "react";

// const AIInsightsCard = () => {
// 	const [predictions, setPredictions] = useState([]);
// 	const [sentiment, setSentiment] = useState(null);
// 	const [anomalies, setAnomalies] = useState([]);
// 	const [risk, setRisk] = useState(null);

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle>AI Insights</CardTitle>
// 			</CardHeader>
// 			<CardContent>
// 				<Tabs defaultValue="predictions">
// 					<TabsTrigger value="predictions">Price Forecast</TabsTrigger>
// 					<TabsTrigger value="sentiment">Market Sentiment</TabsTrigger>
// 					<TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
// 					<TabsTrigger value="risk">Risk Analysis</TabsTrigger>
// 				</Tabs>

// 				<TabsContent value="predictions">
// 					<PredictionChart data={predictions} />
// 				</TabsContent>

// 				<TabsContent value="sentiment">
// 					<SentimentMeter score={sentiment} />
// 				</TabsContent>

// 				<TabsContent value="anomalies">
// 					<AnomalyChart data={anomalies} />
// 				</TabsContent>

// 				<TabsContent value="risk">
// 					<RiskAssessment data={risk} />
// 				</TabsContent>
// 			</CardContent>
// 		</Card>
// 	);
// };

// export default AIInsightsCard;
