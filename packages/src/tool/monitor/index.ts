export * from "./atomic";
import { monitorAtomicToolsWithExecute } from "./atomic";
export const monitorTools = {
  ...monitorAtomicToolsWithExecute,
} as const;

export type MonitorTool = keyof typeof monitorTools;
