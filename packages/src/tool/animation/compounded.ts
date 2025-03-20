import { z } from "zod";
import { OperationResponse } from "../core/entity";
import { TensorType } from "../core/entity";
import { animationAtomicToolsWithExecute } from "./atomic";
import { defineCompoundTool } from "../core/request";

const animationCompoundedTools = {} as const;

const tool = {
  ...animationAtomicToolsWithExecute,
  ...animationCompoundedTools,
};

export { animationCompoundedTools };
