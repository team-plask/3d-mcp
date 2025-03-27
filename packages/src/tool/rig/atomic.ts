import { z } from "zod";
import { createExecutableTools } from "../utils/request";
import { createCrudOperations } from "../utils/utils";
import { RigEntities } from "./entity";

const entityCruds = createCrudOperations(RigEntities);

const rigAtomicTools = {
  ...entityCruds,
} as const;

// Strong typing for each tool
export type RigAtomicTool = keyof typeof rigAtomicTools;

// This preserves the specific parameter and return types
const rigAtomicToolsWithExecute = createExecutableTools(rigAtomicTools);

export { rigAtomicToolsWithExecute };
