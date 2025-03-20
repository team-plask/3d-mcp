export * from "./atomic";
export * from "./entity";
export * from "./compounded";

import { coreAtomicToolsWithExecute } from "./atomic";
import { coreCompoundedTools } from "./compounded";

export const coreTools = {
  ...coreAtomicToolsWithExecute,
  ...coreCompoundedTools,
} as const;
export type CoreTool = keyof typeof coreTools;
