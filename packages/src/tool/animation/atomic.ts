import { createExecutableTools } from "../utils/request";
import { createCrudOperations } from "../utils/utils";
import { AnimationEntities } from "./entity";

const entityCruds = createCrudOperations(AnimationEntities);

/**
 * Animation atomic tools organized by entity type with batch support
 */
const animationAtomicTools = {
  ...entityCruds,
} as const;

export type AnimationTool = keyof typeof animationAtomicTools;

const animationAtomicToolsWithExecute =
  createExecutableTools(animationAtomicTools);

export { animationAtomicToolsWithExecute };
