import { animationAtomicToolsWithExecute } from "./atomic";
import {
  coreAtomicToolsWithExecute,
  coreCompoundedTools,
} from "../core";

const animationCompoundedTools = {};

const tool = {
  ...coreAtomicToolsWithExecute,
  ...coreCompoundedTools,
  ...animationAtomicToolsWithExecute,
  ...animationCompoundedTools,
};

export { animationCompoundedTools };
