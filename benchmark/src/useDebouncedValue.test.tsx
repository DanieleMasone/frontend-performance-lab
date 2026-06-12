import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

function DebouncedHarness() {
  const [value, setValue] = useState("alpha");
  const debounced = useDebouncedValue(value, 200);

  return (
    <div>
      <button type="button" onClick={() => setValue("beta")}>
        Change
      </button>
      <span data-testid="current">{value}</span>
      <span data-testid="debounced">{debounced}</span>
    </div>
  );
}

describe("useDebouncedValue", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("delays updates until the configured timeout", () => {
    vi.useFakeTimers();
    render(<DebouncedHarness />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: /change/i }));
    });

    expect(screen.getByTestId("current").textContent).toBe("beta");
    expect(screen.getByTestId("debounced").textContent).toBe("alpha");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("debounced").textContent).toBe("beta");
  });
});
