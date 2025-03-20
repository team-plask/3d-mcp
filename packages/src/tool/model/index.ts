export * from "./atomic";
export * from "./entity";
export * from "./compounded";

import { modelAtomicToolsWithExecute } from "./atomic";
import { modelCompoundedTools } from "./compounded";

export const modelTools = {
  ...modelAtomicToolsWithExecute,
  ...modelCompoundedTools,
} as const;
export type ModelTool = keyof typeof modelTools;
