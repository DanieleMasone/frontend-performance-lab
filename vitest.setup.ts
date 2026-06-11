import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
});

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  configurable: true,
  value(options: ScrollToOptions | number, y?: number) {
    if (typeof options === "number") {
      this.scrollTop = y ?? 0;
    } else {
      this.scrollTop = options.top ?? 0;
    }

    this.dispatchEvent(new Event("scroll", { bubbles: true }));
  }
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
