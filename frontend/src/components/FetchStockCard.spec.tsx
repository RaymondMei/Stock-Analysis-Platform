// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { jest } from "@jest/globals";
// import {describe, expect, test} from '@jest/globals'
// import FetchStockCard, { FetchStockCardProps } from "./FetchStockCard";

// const mockProps: FetchStockCardProps = {
//   ticker: "AAPL",
//   setTicker: jest.fn(),
//   fetchStockData: jest.fn(),
// };

// describe("FetchStockCard", () => {
//   test("renders FetchStockCard component", () => {
//     render(<FetchStockCard {...mockProps} />);
//     expect(screen.getByText("Fetch Stock Data")).toBeInTheDocument();
//     expect(screen.getByPlaceholderText("Ticker Symbol")).toBeInTheDocument();
//     expect(screen.getByText("Search")).toBeInTheDocument();
//   });

//   test("calls setTicker on input change", () => {
//     render(<FetchStockCard {...mockProps} />);
//     const input = screen.getByPlaceholderText("Ticker Symbol");
//     fireEvent.change(input, { target: { value: "GOOGL" } });
//     expect(mockProps.setTicker).toHaveBeenCalledWith("GOOGL");
//   });

//   test("calls fetchStockData on form submit", () => {
//     render(<FetchStockCard {...mockProps} />);
//     const form = screen.getByRole("form");
//     fireEvent.submit(form);
//     expect(mockProps.fetchStockData).toHaveBeenCalled();
//   });
// });