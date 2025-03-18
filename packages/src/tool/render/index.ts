export * from "./atomic";
export * from "./compounded";

import { renderAtomicToolsWithExecute } from "./atomic";
import { renderCompoundedTools } from "./compounded";

const renderTools = {
  ...renderAtomicToolsWithExecute,
  ...renderCompoundedTools,
} as const;
export type RenderTool = keyof typeof renderTools;
export { renderTools };
