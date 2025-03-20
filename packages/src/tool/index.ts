import {
  animationTools,
  animationAtomicToolsWithExecute,
} from "./animation";
import {
  renderTools,
  renderAtomicToolsWithExecute,
} from "./render";
import {
  coreTools,
  coreAtomicToolsWithExecute,
} from "./core";
import {
  modelTools,
  modelAtomicToolsWithExecute,
} from "./model";

const tools = {
  ...animationTools,
  ...renderTools,
  ...coreTools,
  ...modelTools,
} as const;

const atomicTools = {
  ...animationAtomicToolsWithExecute,
  ...renderAtomicToolsWithExecute,
  ...coreAtomicToolsWithExecute,
  ...modelAtomicToolsWithExecute,
} as const;

// Export the tools for direct access
export { tools, atomicTools, coreTools, modelTools };
