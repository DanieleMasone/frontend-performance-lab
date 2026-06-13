import {
  BenchmarkPanel as SharedBenchmarkPanel,
  type BenchmarkPanelBaseProps
} from "../../../benchmark/src/components/BenchmarkPanel";

export function BenchmarkPanel(props: BenchmarkPanelBaseProps) {
  return <SharedBenchmarkPanel variant="slow" {...props} />;
}
