import { render, screen, within } from "@testing-library/react";
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

  it("updates search input and keeps enterprise rows available", async () => {
    const user = userEvent.setup();
    render(<App />);

    const search = screen.getByRole("searchbox", { name: /search/i });
    await user.type(search, "ent");

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

  it("shows the intentionally full table row count in the benchmark panel", () => {
    render(<App />);

    const panel = screen.getByTestId("slow-benchmark-panel");
    expect(within(panel).getByText(/rows in dom/i)).toBeTruthy();
    expect(screen.getAllByTestId("slow-row").length).toBeGreaterThan(100);
  });
});
