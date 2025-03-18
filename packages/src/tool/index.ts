import { animationTools } from "./animation";
import { renderTools } from "./render";

const tools = {
  ...animationTools,
  ...renderTools,
} as const;

// Export the tools for direct access
export { tools };
