import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("slow app", () => {
  it("renders the main app shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /slow implementation/i })).toBeTruthy();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeTruthy();
    expect(screen.getByTestId("slow-benchmark-panel")).toBeTruthy();
  });

  it("persists the dark mode preference", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("frontend-performance-lab-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: /light mode/i })).toBeTruthy();
  });

  it("updates search input and keeps enterprise rows available", () => {
    render(<App />);

    const search = screen.getByRole("searchbox", { name: /search/i });
    fireEvent.change(search, { target: { value: "ent" } });

    expect((search as HTMLInputElement).value).toBe("ent");
    expect(screen.getAllByTestId("slow-row").length).toBeGreaterThan(0);
  });

  it("runs benchmark controls and records interactions", async () => {
    const user = userEvent.setup();
    render(<App />);

    const panel = screen.getByTestId("slow-benchmark-panel");
    await user.click(within(panel).getByRole("button", { name: /search\/filter/i }));

    expect((screen.getByRole("searchbox", { name: /search/i }) as HTMLInputElement).value).toBe("enterprise");
    expect(within(panel).getByText(/slow enterprise search/i)).toBeTruthy();
  });

  it("runs the remaining benchmark scenarios and reset flow", () => {
    render(<App />);

    const panel = screen.getByTestId("slow-benchmark-panel");

    fireEvent.click(within(panel).getByRole("button", { name: /initial render/i }));
    expect(within(panel).getByText(/slow initial render reset/i)).toBeTruthy();

    fireEvent.click(within(panel).getByRole("button", { name: /large table scroll/i }));
    expect(within(panel).getByText(/slow full table scroll/i)).toBeTruthy();

    fireEvent.click(within(panel).getByRole("button", { name: /heavy chart toggle/i }));
    expect(screen.getByTestId("slow-heavy-chart")).toBeTruthy();

    fireEvent.click(within(panel).getByRole("button", { name: /image gallery load/i }));
    expect(within(panel).getByText(/slow gallery toggle/i)).toBeTruthy();

    fireEvent.click(within(panel).getByRole("button", { name: /reset/i }));
    expect(within(panel).getByText(/no interaction measured/i)).toBeTruthy();
  });

  it("applies filter and sort controls", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Region"), { target: { value: "EMEA" } });
    fireEvent.change(screen.getByLabelText("Tier"), { target: { value: "Enterprise" } });
    fireEvent.change(screen.getByLabelText("Sort"), { target: { value: "latencyMs" } });
    fireEvent.change(screen.getByLabelText("Order"), { target: { value: "asc" } });

    expect((screen.getByLabelText("Region") as HTMLSelectElement).value).toBe("EMEA");
    expect((screen.getByLabelText("Tier") as HTMLSelectElement).value).toBe("Enterprise");
    expect((screen.getByLabelText("Sort") as HTMLSelectElement).value).toBe("latencyMs");
    expect((screen.getByLabelText("Order") as HTMLSelectElement).value).toBe("asc");
  });

  it("shows the intentionally full table row count in the benchmark panel", () => {
    render(<App />);

    const panel = screen.getByTestId("slow-benchmark-panel");
    expect(within(panel).getByText(/rows in dom/i)).toBeTruthy();
    expect(screen.getAllByTestId("slow-row").length).toBeGreaterThan(100);
  });
});
