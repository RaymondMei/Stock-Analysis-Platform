// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom/";
// import StockTableCard, { StockTableCardProps } from "./StockTableCard";
// import {describe, expect, test} from '@jest/globals'
// import { jest } from "@jest/globals";

// jest.mock("react-loader-spinner", () => ({
//   ThreeDots: jest.fn(() => <div>Loading...</div>),
// }));

// const mockProps: StockTableCardProps = {
//   loadingStockData: false,
//   stockData: {
//     "2023-01-01": {
//       open: "100",
//       high: "110",
//       low: "90",
//       close: "105",
//       volume: "1000",
//     },
//   },
// };

// describe("StockTableCard", () => {
//   test("renders StockTableCard component with stock data", () => {
//     render(<StockTableCard {...mockProps} />);
//     expect(screen.getByText("Stock Data")).toBeInTheDocument();
//     expect(screen.getByText("2023-01-01")).toBeInTheDocument();
//     expect(screen.getByText("100")).toBeInTheDocument();
//     expect(screen.getByText("110")).toBeInTheDocument();
//     expect(screen.getByText("90")).toBeInTheDocument();
//     expect(screen.getByText("105")).toBeInTheDocument();
//     expect(screen.getByText("1000")).toBeInTheDocument();
//   });

//   test("renders loading spinner when loadingStockData is true", () => {
//     render(<StockTableCard {...mockProps} loadingStockData={true} stockData={undefined} />);
//     expect(screen.getByText("Loading...")).toBeInTheDocument();
//   });

//   test("renders no data message when stockData is empty", () => {
//     render(<StockTableCard {...mockProps} stockData={undefined} />);
//     expect(screen.getByText("No data available")).toBeInTheDocument();
//   });
// });