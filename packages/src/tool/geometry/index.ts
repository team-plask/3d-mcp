export * from "./atomic";
export * from "./compounded";

import { geometryAtomicToolsWithExecute } from "./atomic";
import { geometryCompoundedTools } from "./compounded";

export const geometryTools = {
  ...geometryAtomicToolsWithExecute,
  ...geometryCompoundedTools,
} as const;
export type GeometryTools = keyof typeof geometryTools;
