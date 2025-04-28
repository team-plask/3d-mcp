import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server
const server = new McpServer({
  name: "Office-MCP-Bridge",
  version: "1.0.0"
});

// Set up server resources and tools
setupPowerPointTools(server);
setupExcelTools(server);
// Add other Office app tools as needed

// Start the server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

// Function to set up PowerPoint-specific tools
function setupPowerPointTools(server) {
  // Add a tool to create a new slide
  server.tool(
    "ppt-create-slide",
    {
      title: z.string(),
      content: z.string(),
      layout: z.enum(["title", "content", "twoContent", "blank"]).optional()
    },
    async ({ title, content, layout = "content" }) => {
      // This will communicate with your add-in web server
      try {
        const response = await fetch("http://localhost:3000/office-addin/powerpoint/create-slide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, layout })
        });
        
        const result = await response.json();
        return {
          content: [{ type: "text", text: `Slide created: ${result.slideId}` }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error creating slide: ${error.message}` }],
          isError: true
        };
      }
    }
  );
  
  // Add a tool to get slide information
  server.tool(
    "ppt-get-slides",
    {},
    async () => {
      try {
        const response = await fetch("http://localhost:3000/office-addin/powerpoint/get-slides");
        const slides = await response.json();
        return {
          content: [{ type: "text", text: JSON.stringify(slides, null, 2) }]
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error getting slides: ${error.message}` }],
          isError: true
        };
      }
    }
  );
}

// Function to set up Excel-specific tools
function setupExcelTools(server) {
  // Similar pattern for Excel tools
  // ...
}