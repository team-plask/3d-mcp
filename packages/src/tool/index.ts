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
import {
  rigTools,
  rigAtomicToolsWithExecute,
  RigEntities,
} from "./rig";
import {
  monitorTools,
  monitorAtomicToolsWithExecute,
} from "./monitor";

const tools = {
  ...animationTools,
  ...renderTools,
  ...coreTools,
  ...modelTools,
  ...rigTools,
  ...monitorTools,
} as const;

const atomicTools = {
  ...animationAtomicToolsWithExecute,
  ...renderAtomicToolsWithExecute,
  ...coreAtomicToolsWithExecute,
  ...modelAtomicToolsWithExecute,
  ...rigAtomicToolsWithExecute,
  ...monitorAtomicToolsWithExecute,
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
