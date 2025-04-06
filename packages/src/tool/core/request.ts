import { imageContent } from "fastmcp";
import { z } from "zod";

/**
 * Plugin configuration type
 */
interface PluginConfig {
  name: string;
  url: string;
  port: number;
}

/**
 * Available plugin configurations
 */
const PLUGINS: Record<string, PluginConfig> = {
  blender: {
    name: "blender",
    url: "127.0.0.1",
    port: 8002,
  },
  maya: {
    name: "maya",
    url: "127.0.0.1",
    port: 8001,
  },
  unreal: {
    name: "unreal",
    url: "127.0.0.1",
    port: 8000,
  },
};

/**
 * Map of tool categories to their respective plugins
 */
const TOOL_PLUGIN_MAP: Record<string, string> = {
  animation: "blender", // Default animation tools to Blender
  render: "maya", // Default render tools to Maya
};

/**
 * Get the appropriate plugin for a tool
 * @param toolName The name of the tool being executed
 * @returns The plugin configuration
 */
function getPluginForTool(toolName: string): PluginConfig {
  // For now using a simple mapping based on tool categories
  // This could be extended with more sophisticated routing logic

  // Try to determine the category from the tool name
  // This is a simple implementation - in a real system you might have a more robust way to map tools to plugins
  const category = Object.keys(TOOL_PLUGIN_MAP).find(
    (cat) =>
      toolName.toLowerCase().includes(cat.toLowerCase())
  );

  const pluginName = category
    ? TOOL_PLUGIN_MAP[category]
    : "blender"; // Default to blender if no match
  return PLUGINS[pluginName!]!;
}

/**
 * Request function to send a POST request to a plug-in
 * @param params Request parameters
 * @returns Response data
 */
async function request<
  T extends { toolName: string; parameters: any }
>(params: T, log: any): Promise<unknown> {
  // Determine which plugin to use based on the tool name
  const plugin = getPluginForTool(params.toolName);
  const url = `http://${plugin.url}:${plugin.port}`;
  log.info(
    `Request to ${url} with tool ${params.toolName}`
  );
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tool: params.toolName,
        params: params.parameters,
      }),
    });

    if (!result.ok) {
      throw new Error(
        `Request failed: ${result.status} ${result.statusText}`
      );
    }

    return await result.json();
  } catch (e) {
    log.info(e);
  }
}

/**
 * Creates executable versions of animation tools
 * @param toolDefs Tool definitions with parameters and return schemas
 * @returns Object with the same keys but with executable functions
 */
function createExecutableTools<
  T extends Record<
    string,
    {
      parameters: z.ZodType;
      returns: z.ZodType;
      description: string;
    }
  >
>(toolDefs: T) {
  type ToolExecutors = {
    [K in keyof T]: {
      description: string;
      parameters: T[K]["parameters"];
      returns: T[K]["returns"];
      execute: (
        args: z.infer<T[K]["parameters"]>,
        extContext: { log: (msg: string) => void }
      ) => Promise<z.infer<T[K]["returns"]>>;

      executeString: (
        args: z.infer<T[K]["parameters"]>,
        extContext: { log: (msg: string) => void }
      ) => Promise<string>;
    };
  };

  const executableTools = {} as ToolExecutors;

  for (const toolName in toolDefs) {
    executableTools[toolName] = {
      ...toolDefs[toolName],
      execute: async (args, { log }) => {
        const response = await request(
          {
            toolName,
            parameters: args,
          },
          log
        );
        let parsedResponse =
          toolDefs[toolName]!.returns.parse(response);

        return parsedResponse;
      },
      executeString: async (args, { log }) => {
        let response = await request(
          {
            toolName,
            parameters: args,
          },
          log
        );

        if (response.content !== undefined) {
          return {
            content: await Promise.all(
              response.content.path.map((c: any) => {
                if (response.content.type === "image") {
                  return imageContent({
                    path: c,
                  });
                }
              })
            ),
          };
        }

        return JSON.stringify(response);
      },
    };
  }

  return executableTools;
}

/**
 * Interface for tool configuration
 */
interface CompoundToolConfig<
  P extends z.ZodType,
  R extends z.ZodType
> {
  description: string;
  parameters: P;
  returns: R;
  execute: (params: z.infer<P>) => Promise<z.infer<R>>;
}

/**
 * Helper function to define a compound tool with proper typing
 */
function defineCompoundTool<
  P extends z.ZodType,
  R extends z.ZodType
>(
  config: CompoundToolConfig<P, R>
): {
  description: string;
  parameters: P;
  returns: R;
  execute: (params: unknown) => Promise<z.infer<R>>;
} {
  return {
    description: config.description,
    parameters: config.parameters,
    returns: config.returns,
    execute: async (
      params: unknown
    ): Promise<z.infer<R>> => {
      // Parse and validate parameters using the tool's schema
      const validParams = config.parameters.parse(params);
      return config.execute(validParams);
    },
  };
}

export {
  request,
  createExecutableTools,
  defineCompoundTool,
  PLUGINS,
  getPluginForTool,
};
