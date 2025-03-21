import {
  animationTools,
  animationAtomicToolsWithExecute,
  AnimationEntities,
} from "./animation";
import {
  renderTools,
  renderAtomicToolsWithExecute,
} from "./render";
import {
  coreTools,
  coreAtomicToolsWithExecute,
  CoreEntities,
} from "./core";
import {
  modelTools,
  modelAtomicToolsWithExecute,
  ModelEntities,
} from "./model";
import { RigEntities } from "./rig/entity";
import { rigAtomicToolsWithExecute } from "./rig/atomic";

const tools = {
  ...animationTools,
  ...renderTools,
  ...coreTools,
  ...modelTools,
  ...rigAtomicToolsWithExecute,
} as const;

const atomicTools = {
  ...animationAtomicToolsWithExecute,
  ...renderAtomicToolsWithExecute,
  ...coreAtomicToolsWithExecute,
  ...modelAtomicToolsWithExecute,
  ...rigAtomicToolsWithExecute,
} as const;

const entities = {
  AnimationEntities,
  CoreEntities,
  ModelEntities,
  RigEntities,
} as const;

// Export the tools and entities for direct access
export {
  tools,
  atomicTools,
  coreTools,
  modelTools,
  entities,
};
