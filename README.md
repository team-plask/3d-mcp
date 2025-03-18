# 3D Model Context Protocol (3D-MCP)

![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue) 

## Overview

3D-MCP is a universal Model Context Protocol implementation for 3D creative workflows. It provides a standardized interface for interacting with various Digital Content Creation (DCC) tools like Blender, Maya, Unreal Engine, and other 3D applications through a unified API.

## Table of Contents

- [Key Concepts](#key-concepts)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Tool Categories](#tool-categories)
- [Contributing](#contributing)

## Key Concepts

3D-MCP solves several fundamental problems in 3D creative workflows:

1. **Fragmentation**: Each DCC tool (Blender, Maya, Unreal, etc.) has its own API and language (Python, MEL, Blueprint)
2. **Code duplication**: Similar operations require different implementations across tools
3. **Integration overhead**: Building cross-tool workflows requires learning multiple APIs

Our solution is a universal protocol layer that:

- Provides a **consistent TypeScript API** for all 3D operations
- Uses an **atomic/compound pattern** where complex operations build upon simpler ones
- Implements a **plugin system** where each DCC tool only needs to implement core atomic operations

## Architecture

The architecture follows a client-server model with three main layers:

1. **MCP Server** - Communicates with client applications using the MCP protocol
2. **Tool Layer** - Defines both atomic and compound tools:
   - **Atomic Tools**: Basic operations that must be implemented by each DCC tool plugin
   - **Compound Tools**: Higher-level operations built by combining atomic tools
3. **Plugin Layer** - Tool-specific implementations that execute operations in the target DCC software

```
Client Application → MCP Server → Tools → Plugin → DCC Software
                                    ↑
                                    └── Compound Tools
```

## Getting Started

### Installation

```bash
bun install
```

### Running the Server

```bash
bun run index.ts
```

This starts the MCP server using stdio transport, which can be connected to by any MCP-compatible client.

## Usage

### Connecting to the Server

The server uses the [fastmcp](https://github.com/modelcontextprotocol/fastmcp) package to expose a Model Context Protocol interface. Clients can connect via stdio by default.

### Tool Structure

Tools are organized into domains:

- **Animation**: Tools for keyframe animation, blending, and playback control
- **Render**: Tools for rendering scenes and managing materials
- **Scene**: Tools for scene graph manipulation
- **Material**: Tools for creating and modifying materials

Each domain contains:

- atomic.ts - Basic operations implemented by plugins
- compounded.ts - Higher-level operations built from atomic tools
- type.ts - Type definitions for the domain
- index.ts - Exports for the domain's tools

## Tool Categories

### Animation Tools

Animation tools provide functionality for creating and manipulating keyframe animations:

- Creating animation clips and channels
- Adding and removing keyframes
- Controlling animation playback
- Blending between animations
- Importing animation data

### Render Tools

Render tools manage the rendering process:

- Setting up rendering parameters
- Managing materials and textures
- Configuring lighting
- Executing render operations

### Core Types

The project uses [Zod](https://github.com/colinhacks/zod) for runtime type validation, with core types aligned with glTF standards where appropriate:

- Transform components (translation, rotation, scale)
- Material definitions
- Animation data structures


## Contributing

Contributions are welcome! Here are the main areas where you can help:

1. Implementing new atomic tools
2. Creating compound tools from existing atomic tools
3. Adding support for new DCC tools
4. Improving type definitions and documentation
