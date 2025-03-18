import { z } from "zod";

/**
 * Request function to send a POST request to a plug-in
 * @param params Request parameters
 * @returns Response data
 */
async function request<T>(params: T): Promise<unknown> {
  const result = await fetch(
    "https://api.example.com/endpoint",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  if (!result.ok) {
    throw new Error(
      `Request failed: ${result.status} ${result.statusText}`
    );
  }

  return await result.json();
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
        args: z.infer<T[K]["parameters"]>
      ) => Promise<z.infer<T[K]["returns"]>>;
    };
  };

  const executableTools = {} as ToolExecutors;

  for (const toolName in toolDefs) {
    executableTools[toolName] = {
      ...toolDefs[toolName],
      execute: async (args) => {
        const response = await request({
          toolName,
          parameters: args,
        });
        const parsedResponse =
          toolDefs[toolName]!.returns.parse(response);
        return parsedResponse;
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
};
