import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductionApplicationsModule } from "@/components/lab/ProductionApplicationsModule";

describe("ProductionApplicationsModule Render Tests", () => {
  it("renders Architecture 1: Batch Scoring Pipeline initially without errors", () => {
    render(<ProductionApplicationsModule />);
    expect(screen.getByText("Production Batch Scoring Pipeline Architecture")).toBeDefined();
    expect(screen.getByText("Production Scenario: Customer Churn Prediction Engine")).toBeDefined();

    // Check presence of pipeline steps
    expect(screen.getAllByText("Data Sources")[0]).toBeDefined();
    expect(screen.getAllByText("Data Ingestion (ETL / ELT)")[0]).toBeDefined();
    expect(screen.getAllByText("Feature Store / Data Warehouse")[0]).toBeDefined();
  });

  it("selects a batch pipeline step to inspect operational details", () => {
    render(<ProductionApplicationsModule />);
    const validationBtn = screen.getAllByRole("button", { name: /Data Validation & Quality Checks/i })[0];
    fireEvent.click(validationBtn);

    expect(screen.getAllByText("Operational Execution Details")[0]).toBeDefined();
    expect(screen.getAllByText("Production Monitoring & Failure Handling")[0]).toBeDefined();
  });

  it("switches to Architecture 2: Real-Time Microservice Scoring", () => {
    render(<ProductionApplicationsModule />);
    const realtimeTab = screen.getByRole("button", { name: /Architecture 2: Real-Time Microservice Scoring/i });
    fireEvent.click(realtimeTab);

    expect(screen.getByText("Real-Time Microservice Scoring Architecture")).toBeDefined();
    expect(screen.getByText("Production Scenario: Instant Loan-Risk Assessment Service")).toBeDefined();
    expect(screen.getAllByText("FastAPI Prediction Microservice")[0]).toBeDefined();

    // Inspect in-memory model node to verify crucial architecture callout
    const inMemBtn = screen.getAllByRole("button", { name: /In-Memory Model Scoring/i })[0];
    fireEvent.click(inMemBtn);

    expect(screen.getByText(/Crucial Architectural Rule: Pre-Load Model Artifacts/i)).toBeDefined();
  });

  it("switches to Batch vs Real-Time Scoring Matrix", () => {
    render(<ProductionApplicationsModule />);
    const comparisonTab = screen.getByRole("button", { name: /Batch vs Real-Time Scoring Matrix/i });
    fireEvent.click(comparisonTab);

    expect(screen.getByText("Batch Scoring vs. Real-Time Microservice Scoring")).toBeDefined();
    expect(screen.getByText("Prediction Trigger")).toBeDefined();
    expect(screen.getByText("Latency SLA")).toBeDefined();
    expect(screen.getByText("Processing Scale")).toBeDefined();
    expect(screen.getByText("Scaling Mechanics")).toBeDefined();
    expect(screen.getByText("Failure Recovery")).toBeDefined();
  });
});
