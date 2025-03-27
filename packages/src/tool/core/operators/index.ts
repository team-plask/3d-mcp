import { createExecutableTools } from "../../utils/request";
import CoreOps from "./atomic/coreO";
import HistoryOps from "./atomic/historyO";
import QueryOps from "./atomic/queryO";
import SelectOps from "./atomic/selectO";

const coreAtomicToolsWithExecute = createExecutableTools({
  ...CoreOps,
  ...HistoryOps,
  ...QueryOps,
  ...SelectOps,
});

export default { coreAtomicToolsWithExecute };
