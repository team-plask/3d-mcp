import { createExecutableTools } from "../../utils/request";
import HierarchyOps from "./atomic/hierarchyO";
import TransformOps from "./atomic/transformO";

const coreAtomicToolsWithExecute = createExecutableTools({
  ...HierarchyOps,
  ...TransformOps,
});

export { coreAtomicToolsWithExecute };
