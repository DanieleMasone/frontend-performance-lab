import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("optimized app", () => {
  it("renders the main app shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /optimized implementation/i })).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeTruthy();
    expect(screen.getByTestId("optimized-benchmark-panel")).toBeTruthy();
  });

  it("persists the dark mode preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("frontend-performance-lab-theme")).toBe("dark");
  });

  it("updates search input and runs the benchmark search scenario", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox", { name: /search/i }), "enterprise");
    expect((screen.getByRole("searchbox", { name: /search/i }) as HTMLInputElement).value).toBe("enterprise");

    const panel = screen.getByTestId("optimized-benchmark-panel");
    await user.click(within(panel).getByRole("button", { name: /search\/filter/i }));

    expect(within(panel).getByText(/optimized enterprise search/i)).toBeTruthy();
  });

  it("renders only a virtual window of account rows", () => {
    render(<App />);

    const table = screen.getByRole("table", { name: /account portfolio/i });
    const renderedRows = screen.getAllByTestId("optimized-row");

    expect(Number(table.getAttribute("aria-rowcount"))).toBeGreaterThan(renderedRows.length);
    expect(renderedRows.length).toBeLessThan(40);
  });

  it("loads the heavy chart section through the lazy boundary", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByTestId("optimized-heavy-chart")).toBeNull();
    await user.click(screen.getByRole("button", { name: /show chart/i }));

    await waitFor(() => {
      expect(screen.getByTestId("optimized-heavy-chart")).toBeTruthy();
    });
  });

  it("supports keyboard scrolling on the virtualized table", async () => {
    const user = userEvent.setup();
    render(<App />);

    const rowGroups = screen.getAllByRole("rowgroup");
    const scrollRegion = document.querySelector<HTMLElement>('[data-table-scroll="optimized"]');

    expect(scrollRegion).toBeTruthy();
    scrollRegion?.focus();
    await user.keyboard("{PageDown}");

    expect(scrollRegion?.scrollTop).toBeGreaterThan(0);
    expect(rowGroups.length).toBeGreaterThan(1);
  });
});
