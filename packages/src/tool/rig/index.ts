export * from "./atomic";
export * from "./entity";
export * from "./compounded";

import { rigAtomicToolsWithExecute } from "./atomic";
import { rigCompoundedTools } from "./compounded";

export const rigTools = {
  ...rigAtomicToolsWithExecute,
  ...rigCompoundedTools,
} as const;
export type RigTool = keyof typeof rigTools;
