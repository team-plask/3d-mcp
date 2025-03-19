import {
  animationTools,
  animationAtomicToolsWithExecute,
} from "./animation";
import {
  renderTools,
  renderAtomicToolsWithExecute,
} from "./render";

const tools = {
  ...animationTools,
  ...renderTools,
} as const;

const atomicTools = {
  ...animationAtomicToolsWithExecute,
  ...renderAtomicToolsWithExecute,
} as const;

// Export the tools for direct access
export { tools, atomicTools };
