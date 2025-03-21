import { join } from "path";
import { type PluginConfig } from "../config/pluginsConfig";
import { getTypeForLanguage } from "../utils/types";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "fs";

/**
 * Generate properly formatted Python docstring
 */
function generatePythonDocstring(tool: any): string {
  const { description, parameters } = tool;

  const paramDocs = [];
  if (parameters && parameters.properties) {
    for (const [name, prop] of Object.entries(
      parameters.properties
    )) {
      const typeName = getTypeForLanguage(prop, "python");
      const paramDesc =
        (prop as any).description ||
        `The ${name} parameter`;
      paramDocs.push(
        `           ${name} (${typeName}): ${paramDesc}`
      );
    }
  }

  const returnProps = tool.returns?.properties || {};
  const returnDocs =
    Object.keys(returnProps).length > 0
      ? Object.entries(returnProps)
          .map(([name, prop]) => {
            const typeName = getTypeForLanguage(
              prop,
              "python"
            );
            const desc =
              (prop as any).description ||
              `The ${name} return value`;
            return `           ${name} (${typeName}): ${desc}`;
          })
          .join("\n")
      : "           Dict[str, Any]: Operation response with success status";

  return `
    """
    ${description}
    
    Args:
${
  paramDocs.length > 0
    ? paramDocs.join("\n")
    : "    params (Dict[str, Any]): Tool parameters"
}
        
    Returns:
${returnDocs}
    """`;
}

/**
 * Generate parameter validation code for Python with proper indentation
 */
function generatePythonParamValidation(
  schema: any
): string {
  if (!schema || !schema.properties) return "";

  const requiredProps = new Set<string>(
    schema.required || []
  );
  const validationBlocks = [];

  // First extract all required parameters
  if (requiredProps.size > 0) {
    const requiredChecks = [];
    for (const name of requiredProps) {
      const prop = schema.properties[name];
      const desc =
        (prop as any).description ||
        `The ${name} parameter`;

      requiredChecks.push(`
        # Required parameter: ${desc}
        if "${name}" not in params:
            raise ValueError(f"Required parameter '${name}' is missing")
        ${name} = params["${name}"]`);

      // Add enum validation if applicable
      if (prop.enum) {
        const validValues = JSON.stringify(prop.enum);
        requiredChecks.push(`
        # Validate enum values for ${name}
        if ${name} is not None and ${name} not in ${validValues}:
            raise ValueError(f"Parameter '${name}' out of enum range")`);
      }
    }
    validationBlocks.push(requiredChecks.join("\n\n"));
  }

  // Then extract all optional parameters
  const optionalParams = Object.entries(schema.properties)
    .filter(([name]) => !requiredProps.has(name))
    .map(([name, prop]) => {
      const desc =
        (prop as any).description ||
        `The ${name} parameter`;

      let block = `
        # Optional parameter: ${desc}
        ${name} = params.get("${name}")`;

      // Add enum validation if applicable
      if ((prop as any).enum) {
        const validValues = JSON.stringify(
          (prop as any).enum
        );
        block += `\n        
        # Validate enum values for ${name}
        if ${name} is not None and ${name} not in ${validValues}:
            raise ValueError(f"Parameter '${name}' must be one of ${validValues}, got ${name}")`;
      }

      return block;
    });

  if (optionalParams.length > 0) {
    validationBlocks.push(optionalParams.join("\n\n"));
  }

  return validationBlocks.join("\n\n");
}

/**
 * Generate common implementation for Python-based plugins
 */
function generatePythonImplementation(
  category: string,
  tools: any[],
  plugin: PluginConfig
): string {
  const toolsImplementation = tools
    .map((tool) => {
      const paramJsonSchema = tool.parameters;
      const returnJsonSchema = tool.returns;
      const toolName = tool.name;
      const docstring = generatePythonDocstring(tool);
      const paramValidation =
        generatePythonParamValidation(paramJsonSchema);

      // Determine return structure
      const returnProps = returnJsonSchema
        ? Object.keys(returnJsonSchema.properties || {})
        : ["success"];

      const returnStructure = returnProps
        .map((prop) => {
          if (prop === "success") return '"success": True';
          return `"${prop}": None  `;
        })
        .join(", # TODO: Implement  \n                ");

      return `def ${toolName}(params: Dict[str, Any]) -> Dict[str, Any]:
${docstring}
    tool_name = "${toolName}"  # Define tool name for logging
    ${plugin.printFormat}
    
    try:
${paramValidation || "        # No parameters to validate"}
        
        # TODO: Implement actual ${plugin.name} API calls
        # This is a placeholder implementation
        
        return {
            ${returnStructure}
        }
        
    except Exception as e:
        ${plugin.errorFormat}
        return {"success": False, "error": str(e)}`;
    })
    .join("\n\n");

  return `# Generated ${plugin.name} implementation for ${category} atomic tools
# This file is generated - DO NOT EDIT DIRECTLY


from typing import Dict, Any, Optional, List, Union, Tuple

${toolsImplementation}
`;
}

/**
 * Generate Python server component for plugin
 */
function generatePythonServer(
  plugin: PluginConfig,
  categories: string[]
): string {
  const imports = categories
    .map(
      (category) =>
        `from ${category} import ${category}_atomic`
    )
    .join("\n");

  const toolRegistrations = categories
    .map(
      (category) =>
        `    # Register ${category} tools\n    ${readdirSync(
          join(
            process.cwd(),
            "packages",
            plugin.dir,
            category
          )
        )
          .filter(
            (file) =>
              file.endsWith(".py") &&
              file.includes("_atomic")
          )
          .map((file) => {
            const moduleName = file.replace(".py", "");
            return `    for name, func in inspect.getmembers(${moduleName}, inspect.isfunction):\n            self.register_tool(name, func)`;
          })
          .join("\n")}`
    )
    .join("\n\n");

  // Wrap application-specific imports in try-except blocks
  const safeImportStatements = plugin.importStatements
    .map((imp) => {
      // Detect if this is an application-specific import
      if (
        imp.includes("bpy") ||
        imp.includes("maya.cmds") ||
        imp.includes("maya.mel") ||
        imp.includes("unreal")
      ) {
        return `try:
    ${imp}
    HAS_APP_LIBS = True
except ImportError:
    print(f"Warning: Could not import ${
      imp.split(" ")[1]
    }. Running in mock mode.")
    HAS_APP_LIBS = False`;
      }
      return imp;
    })
    .join("\n");

  return `# Generated ${plugin.name} MCP server
# This file is generated - DO NOT EDIT DIRECTLY

${safeImportStatements}
import inspect
import socket
import json
import sys
import os
import argparse
from typing import Dict, Any, Callable

# Add mock implementation for testing when application libraries aren't available
if 'HAS_APP_LIBS' not in globals():
    HAS_APP_LIBS = True

# Import all atomic tool modules
${imports}

class MCPServer:
    """
    Server component that receives MCP tool requests and routes them to appropriate functions
    """
    
    def __init__(self, host="localhost", port=8000):
        self.host = host
        self.port = port
        self.tools: Dict[str, Callable] = {}
        self.server_socket = None
        self.is_mock_mode = not HAS_APP_LIBS
        
        if self.is_mock_mode:
            print("WARNING: Running in mock mode - some functionality will be limited")
            # Register a test function for test connections
            self.register_tool("test", lambda _: {"success": True, "message": "Test connection successful (mock mode)"})
        
    def register_tool(self, name: str, func: Callable):
        """Register a tool function with the server"""
        print(f"Registering tool: {name}")
        self.tools[name] = func
        
    def register_all_tools(self):
        """Register all available tool functions"""
${toolRegistrations}
        print(f"Registered {len(self.tools)} tools")
        
    def start(self):
        """Start the MCP server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            print(f"MCP Server started on {self.host}:{self.port}")
            
            while True:
                client_socket, address = self.server_socket.accept()
                print(f"Connection from {address}")
                self.handle_client(client_socket)
                
        except KeyboardInterrupt:
            print("Server shutting down...")
        finally:
            if self.server_socket:
                self.server_socket.close()
                
    def handle_client(self, client_socket):
        """Handle client connection and route requests to appropriate tool"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
                
            request = json.loads(data.decode('utf-8'))
            tool_name = request.get("tool")
            params = request.get("params", {})
            
            if tool_name in self.tools:
                print(f"Executing tool: {tool_name}")
                result = self.tools[tool_name](params)
                response = json.dumps(result).encode('utf-8')
            else:
                response = json.dumps({
                    "success": False,
                    "error": f"Unknown tool: {tool_name}"
                }).encode('utf-8')
                
            client_socket.send(response)
            
        except Exception as e:
            error_response = json.dumps({
                "success": False,
                "error": str(e)
            }).encode('utf-8')
            client_socket.send(error_response)
        finally:
            client_socket.close()

def main():
    """Main entry point to start the MCP server"""
    parser = argparse.ArgumentParser(description='Start the MCP server')
    parser.add_argument('--port', type=int, default=8000, help='Port to listen on')
    parser.add_argument('--host', type=str, default='localhost', help='Host to bind to')
    args = parser.parse_args()
    
    server = MCPServer(host=args.host, port=args.port)
    print(f"Starting MCP server on {args.host}:{args.port}")
    server.register_all_tools()
    server.start()

if __name__ == "__main__":
    main()
`;
}

export {
  generatePythonImplementation,
  generatePythonServer,
  generatePythonDocstring,
  generatePythonParamValidation,
};
