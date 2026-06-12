import { describe, expect, it } from "vitest";
import { calculateVirtualWindow } from "./virtualization";

describe("virtualization math", () => {
  it("returns an empty window for invalid dimensions", () => {
    expect(
      calculateVirtualWindow({
        itemCount: 0,
        rowHeight: 58,
        viewportHeight: 580,
        scrollTop: 0
      })
    ).toEqual({
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      totalHeight: 0,
      visibleCount: 0
    });
  });

  it("calculates an overscanned window for scroll position", () => {
    const window = calculateVirtualWindow({
      itemCount: 200,
      rowHeight: 50,
      viewportHeight: 250,
      scrollTop: 500,
      overscan: 2
    });

    expect(window).toEqual({
      startIndex: 8,
      endIndex: 17,
      offsetTop: 400,
      totalHeight: 10_000,
      visibleCount: 9
    });
  });

  it("clamps negative scroll and end indices", () => {
    const topWindow = calculateVirtualWindow({
      itemCount: 4,
      rowHeight: 20,
      viewportHeight: 100,
      scrollTop: -100,
      overscan: 3
    });

    expect(topWindow.startIndex).toBe(0);
    expect(topWindow.endIndex).toBe(4);
    expect(topWindow.visibleCount).toBe(4);
  });
});
