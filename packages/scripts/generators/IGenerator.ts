import { type PluginConfig } from "../config/pluginsConfig";

/**
 * Common interface for all code generators
 */
export interface IGenerator {
  /**
   * Generate implementation code for a specific plugin, category and tools
   */
  generateImplementation(
    plugin: PluginConfig,
    category: string,
    tools: any[]
  ): void;

  /**
   * Generate server component for a plugin
   */
  generateServer?(
    plugin: PluginConfig,
    categories: string[]
  ): void;
}
