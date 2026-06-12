import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  usePersistentTheme
} from "./usePersistentTheme";

function ThemeHarness() {
  const { theme, toggleTheme } = usePersistentTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  );
}

describe("persistent theme utilities", () => {
  it("reads and applies theme values", () => {
    expect(readStoredTheme()).toBe("light");

    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(readStoredTheme()).toBe("dark");

    window.localStorage.setItem(THEME_STORAGE_KEY, "unexpected");
    expect(readStoredTheme()).toBe("light");

    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("toggles and persists theme through the hook", async () => {
    const user = userEvent.setup();
    render(<ThemeHarness />);

    expect(screen.getByRole("button", { name: "light" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "light" }));

    expect(screen.getByRole("button", { name: "dark" })).toBeTruthy();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
