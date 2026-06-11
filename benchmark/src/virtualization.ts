export interface VirtualWindowInput {
  itemCount: number;
  rowHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}

export interface VirtualWindow {
  startIndex: number;
  endIndex: number;
  offsetTop: number;
  totalHeight: number;
  visibleCount: number;
}

export function calculateVirtualWindow({
  itemCount,
  rowHeight,
  viewportHeight,
  scrollTop,
  overscan = 6
}: VirtualWindowInput): VirtualWindow {
  if (itemCount <= 0 || rowHeight <= 0 || viewportHeight <= 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      totalHeight: Math.max(0, itemCount * rowHeight),
      visibleCount: 0
    };
  }

  const visibleRows = Math.ceil(viewportHeight / rowHeight);
  const firstVisible = Math.floor(Math.max(0, scrollTop) / rowHeight);
  const startIndex = Math.max(0, firstVisible - overscan);
  const endIndex = Math.min(itemCount, firstVisible + visibleRows + overscan);

  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * rowHeight,
    totalHeight: itemCount * rowHeight,
    visibleCount: Math.max(0, endIndex - startIndex)
  };
}
