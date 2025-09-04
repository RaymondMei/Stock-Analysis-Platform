// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import BacktestCard, { BacktestCardProps } from "./BacktestCard";
// import { jest } from "@jest/globals";
// import {describe, expect, test} from '@jest/globals'

// const mockProps: BacktestCardProps = {
//   initialInvestment: 1000,
//   setInitialInvestment: jest.fn(),
//   shortWindow: 5,
//   setShortWindow: jest.fn(),
//   longWindow: 20,
//   setLongWindow: jest.fn(),
//   backtestResults: undefined,
//   runBacktest: jest.fn(),
// };

// describe("BacktestCard", () => {
//   test("renders BacktestCard component", () => {
//     render(<BacktestCard {...mockProps} />);
//     expect(screen.getByText("Backtest")).toBeInTheDocument();
//     expect(screen.getByLabelText("Initial Investment")).toBeInTheDocument();
//     expect(screen.getByLabelText("Short Window")).toBeInTheDocument();
//     expect(screen.getByLabelText("Long Window")).toBeInTheDocument();
//   });

//   test("calls setInitialInvestment on input change", () => {
//     render(<BacktestCard {...mockProps} />);
//     const input = screen.getByLabelText("Initial Investment");
//     fireEvent.change(input, { target: { value: "2000" } });
//     expect(mockProps.setInitialInvestment).toHaveBeenCalledWith(2000);
//   });

//   test("calls setShortWindow on input change", () => {
//     render(<BacktestCard {...mockProps} />);
//     const input = screen.getByLabelText("Short Window");
//     fireEvent.change(input, { target: { value: "10" } });
//     expect(mockProps.setShortWindow).toHaveBeenCalledWith(10);
//   });

//   test("calls setLongWindow on input change", () => {
//     render(<BacktestCard {...mockProps} />);
//     const input = screen.getByLabelText("Long Window");
//     fireEvent.change(input, { target: { value: "30" } });
//     expect(mockProps.setLongWindow).toHaveBeenCalledWith(30);
//   });

//   test("calls runBacktest on form submit", () => {
//     render(<BacktestCard {...mockProps} />);
//     const form = screen.getByRole("form");
//     fireEvent.submit(form);
//     expect(mockProps.runBacktest).toHaveBeenCalled();
//   });
// });