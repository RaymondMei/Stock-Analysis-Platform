import { Card } from "@/components/ui/card";
import {
	ChartCanvas,
	Chart,
	CandlestickSeries,
	XAxis,
	YAxis,
	discontinuousTimeScaleProvider,
} from "react-financial-charts";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { StockData } from "@/App";

export interface StockGraphCardProps {
	stockData: StockData;
}

const StockGraphCard = ({ stockData }: StockGraphCardProps) => {
	const componentRef = useRef<HTMLHeadingElement>(null);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useLayoutEffect(() => {
		setWidth(componentRef.current?.offsetWidth ?? 0);
		setHeight(componentRef.current?.offsetHeight ?? 0);
		const handleResize = () => {
			setWidth(componentRef.current?.offsetWidth ?? 0);
			setHeight(componentRef.current?.offsetHeight ?? 0);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const parsedData = useMemo(() => {
		if (!stockData) return [];
		return Object.entries(stockData)
			.reverse()
			.map(([date, data]) => ({
				date: new Date(date),
				open: +data.open,
				high: +data.high,
				low: +data.low,
				close: +data.close,
				volume: +data.volume,
			}));
	}, [stockData]);

	// Use discontinuous time scale for x-axis
	const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
		(d) => d.date
	);
	const {
		data: chartData,
		xScale,
		xAccessor,
		displayXAccessor,
	} = xScaleProvider(parsedData);

	const margin = { left: 50, right: 50, top: 50, bottom: 50 };
	const xExtents = [
		xAccessor(chartData[0]),
		xAccessor(chartData[chartData.length - 1]),
	];

	return (
		<Card
			className="col-span-3 row-span-8 p-4 row-start-1 col-start-2"
			ref={componentRef}
		>
			{stockData && (
				<ChartCanvas
					height={height - 35}
					width={width - 35}
					ratio={window.devicePixelRatio}
					margin={margin}
					data={chartData}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}
					seriesName="Stock Data"
				>
					<Chart id={1} yExtents={(d) => [d.high, d.low]}>
						<XAxis axisAt="bottom" orient="bottom" ticks={6} />
						<YAxis axisAt="left" orient="left" ticks={5} />
						<CandlestickSeries />
					</Chart>
				</ChartCanvas>
			)}
		</Card>
	);
};

export default StockGraphCard;
