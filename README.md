# 3D-MCP: Semantic Interface for 3D Digital Content Creation

![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue) ![License](https://img.shields.io/badge/License-Apache_2.0-green)

## Overview

3D-MCP is a universal [Model Context Protocol](https://modelcontextprotocol.io/introduction) implementation that serves as a semantic layer between LLMs and 3D creative software. It provides a standardized interface for interacting with various Digital Content Creation (DCC) tools like Blender, Maya, Unreal Engine, and other 3D applications through a unified API.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Architectural Patterns](#architectural-patterns)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Tool Categories](#tool-categories)
- [Contributing](#contributing)
- [License](#license)

## Design Philosophy

3D-MCP addresses fundamental challenges in 3D workflows:

### Problems Solved

1. **Fragmentation**: Each DCC tool (Blender, Maya, Unreal, etc.) has its own API and language (Python, MEL, Blueprint)
2. **Code duplication**: Similar operations require different implementations across tools
3. **Semantic gap**: LLMs need to understand 3D concepts at a high level, not implementation details

### Solution Architecture

Our solution implements several key design patterns:

- **Interface Segregation Principle**: Abstract atomic tools define clear, focused interfaces
- **Dependency Inversion Principle**: High-level operations depend on abstractions, not implementations
- **Semantic Abstraction**: Exposing 3D concepts as intentional operations rather than mechanical manipulations

## System Architecture


The architecture follows a client-server model with distinct responsibility layers:

### 1. Semantic Interface Layer (MCP Server)
- Defines the semantic interface that LLMs interact with
- Exposes tools and operations in LLM-friendly terminology
- Handles protocol communication and message routing

### 2. Abstract Tool Layer
- Defines tool interfaces as abstract contracts
- Specifies input/output schemas with Zod validation
- Tool interfaces are organized by domains (Animation, Rendering, etc.)

### 3. Compound Tool Layer
- Implements higher-level operations by composing atomic tools
- Follows composition patterns for complex operations
- Depends only on abstract tool interfaces, not concrete implementations

### 4. Plugin System
- Each DCC tool implements concrete versions of the atomic tools
- Plugins translate abstract operations to tool-specific API calls
- Implementations are isolated from the semantic interface

```
Client Application → MCP Server → Abstract Tools → Plugin → DCC Software
                          ↑
                          └── Compound Tools
```

## Plugin Code Generation System

### Key Component of the Architecture

The 3D-MCP system includes a code generation system that automatically produces plugin implementations for multiple 3D tools from a single abstract interface definition. This is a crucial architectural component that:

1. **Enforces the Dependency Inversion Principle** by automatically generating concrete implementations from abstract interfaces
2. **Eliminates manual synchronization** between interfaces and implementations
3. **Ensures consistency** across different platform implementations (Blender, Maya, Unreal)

### Schema-Driven Development

The code generation approach implements a schema-driven development pattern:

- Abstract tool interfaces are defined using [Zod](https://github.com/colinhacks/zod) schemas
- Schemas specify both parameter types and return values with validation rules using [zodToJsonSchema](https://github.com/colinhacks/zod-to-json-schema)
- The code generator extracts these schemas and translates them to target languages
- Generated code includes appropriate type conversions, validation, and error handling

### Workflow

The plugin code generation workflow:
```markdown
Abstract Tool Definition (Zod) → Schema Extraction → Platform-specific Code Generation → Plugin Implementation
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

## Tool Categories

### Animation Tools

Animation tools provide a semantic interface for creating and manipulating keyframe animations:

- Creating animation clips and channels
- Adding and removing keyframes
- Controlling animation playback
- Blending between animations
- Importing animation data

### Render Tools

Render tools provide a semantic interface for the rendering process:

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

1. Defining new abstract tool interfaces
2. Implementing compound tools that combine existing atomic tools
3. Creating plugins for additional DCC tools
4. Improving type definitions and documentation

---

*3D-MCP: Bridging the gap between language models and 3D creative software*