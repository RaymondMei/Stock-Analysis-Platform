// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import StockGraphCard from "./StockGraphCard";
// import { jest } from "@jest/globals";
// import {describe, expect, test} from '@jest/globals'
// import { StockData } from "@/App";

// jest.mock("react-financial-charts", () => ({
//   ChartCanvas: jest.fn(() => <div>ChartCanvas</div>),
//   Chart: jest.fn(() => <div>Chart</div>),
//   XAxis: jest.fn(() => <div>XAxis</div>),
//   YAxis: jest.fn(() => <div>YAxis</div>),
//   CandlestickSeries: jest.fn(() => <div>CandlestickSeries</div>),
// }));

// jest.mock("react-loader-spinner", () => ({
//   ThreeDots: jest.fn(() => <div>Loading...</div>),
// }));

// const mockProps = {
//   stockData: [
//     { date: new Date(), open: 100, high: 110, low: 90, close: 105, volume: 1000 },
//   ],
//   loadingStockData: false,
//   height: 500,
//   width: 800,
//   margin: { left: 50, right: 50, top: 10, bottom: 30 },
//   xScale: jest.fn(),
//   xAccessor: jest.fn(),
//   displayXAccessor: jest.fn(),
//   xExtents: [new Date(), new Date()],
// };

// const mockStockData: StockData = {
//   "2024-01-01": {
//     open: "100",
//     high: "110",
//     low: "90",
//     close: "105",
//     volume: "1000",
//   },
//   "2024-01-02": {
//     open: "110",
//     high: "120",
//     low: "100",
//     close: "115",
//     volume: "1500",
//   },
// };

// describe("StockGraphCard", () => {
//   test("renders StockGraphCard component with ChartCanvas when stockData is provided", () => {
//     render(<StockGraphCard  loadingStockData={false} stockData={mockStockData} />);
//     expect(screen.getByText("ChartCanvas")).toBeInTheDocument();
//   });

//   test("renders loading spinner when loadingStockData is true", () => {
//     render(<StockGraphCard {...mockProps} loadingStockData={true} stockData={undefined} />);
//     expect(screen.getByText("Loading...")).toBeInTheDocument();
//   });

//   test("renders nothing when no stockData and not loading", () => {
//     render(<StockGraphCard {...mockProps} stockData={undefined} loadingStockData={false} />);
//     expect(screen.queryByText("ChartCanvas")).not.toBeInTheDocument();
//     expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
//   });
// });