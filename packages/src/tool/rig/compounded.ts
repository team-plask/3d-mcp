import { z } from "zod";
import {} from "../core/entity";
import { defineCompoundTool } from "../core/request";
import { coreAtomicToolsWithExecute } from "../core/atomic";
import { rigAtomicToolsWithExecute } from "./atomic";

/**
 * Compound tools for rigging that build on atomic operations
 */
const rigCompoundedTools = {};

/**
 * Combined tools for execution in compound operations
 */
const tool = {
  ...coreAtomicToolsWithExecute,
  ...rigAtomicToolsWithExecute,
};

export { rigCompoundedTools };
