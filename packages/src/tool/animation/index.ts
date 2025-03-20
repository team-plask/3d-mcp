export * from "./atomic";
export * from "./entity";
export * from "./compounded";

import { animationAtomicToolsWithExecute } from "./atomic";
import { animationCompoundedTools } from "./compounded";

export const animationTools = {
  ...animationAtomicToolsWithExecute,
  ...animationCompoundedTools,
} as const;
export type AnimationTool = keyof typeof animationTools;
