import { FastMCP } from "fastmcp";
import { tools } from "./packages/src/tool";

const server = new FastMCP({
  name: "Addition",
  version: "1.0.0",
});

Object.entries(tools).forEach(([toolName, tool]) => {
  server.addTool({
    name: toolName,
    description: tool.description,
    parameters: tool.parameters,
    execute: tool.executeString as any,
  });
});

server.start({
  transportType: "stdio",
});
