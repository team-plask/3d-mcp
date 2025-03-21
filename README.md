# 3D MCP

![Plugin Tests](https://github.com/team-plask/3d-mcp/workflows/Plugin%20Code%20Generation%20Tests/badge.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue) ![License](https://img.shields.io/badge/License-Apache_2.0-green)

## Overview

3D-MCP is a universal implementation of the [Model Context Protocol](https://modelcontextprotocol.io/introduction) for 3D software. It creates a unified TypeScript interface for LLMs to interact with Blender, Maya, Unreal Engine, and other 3D applications through a single coherent API.

```typescript
// LLMs use the same interface regardless of underlying 3D software
await tools.animation.createKeyframe({
  objectId: "cube_1",
  property: "rotation.x",
  time: 30,
  value: Math.PI/2
});
```

## Core Philosophy & Design Decisions

3D-MCP is built on four interconnected architectural principles that together create a unified system for 3D content creation:

1. **Entity-First Design**: Well-defined domain entities form the foundation of all operations, enabling consistent data modeling across platforms
2. **Type-Safe CRUD Operations**: Automated generation of create, read, update, delete operations with complete type validation
3. **Atomic Operation Layer**: A minimal set of platform-specific implementations that handle fundamental operations
4. **Composable Tool Architecture**: Complex functionality built by combining atomic operations in a platform-agnostic way

This architecture creates a **dependency inversion** where platform-specific implementation details are isolated to atomic operations, while the majority of the codebase remains platform-independent.

## Why These Design Decisions?

**Entity-First Design** was chosen because:
- 3D applications use different object models but share core concepts (meshes, materials, animations)
- Zod schemas provide single-source-of-truth for validation, typing, and documentation
- Strong typing catches errors at compile time rather than runtime
- Rich metadata enables better AI understanding of domain objects

**CRUD Operations as Foundation** because:
- They map cleanly to what 3D applications need to do with entities
- Standardized patterns reduce cognitive overhead
- Auto-generation eliminates repetitive code
- Every entity automatically gets the same consistent interface

**Atomic and Compound Tool Separation** because:
- Only atomic tools need platform-specific implementation (~20% of codebase)
- Compound tools work across all platforms without modification (~80% of codebase)
- New platforms only need to implement atomic operations to gain all functionality
- Maintainable architecture with clear separation of concerns

## Technical Architecture

### 1. Entity-Centric CRUD Architecture

The system's foundation is a rich type system of domain entities that generates CRUD operations:

```typescript
// Define entities with rich metadata using Zod
export const Mesh = NodeBase.extend({
  vertices: z.array(Tensor.VEC3).describe("Array of vertex positions [x, y, z]"),
  normals: z.array(Tensor.VEC3).optional().describe("Array of normal vectors"),
  // ... other properties
});

// CRUD operations generated automatically from entity schemas
const entityCruds = createCrudOperations(ModelEntities);
// => Creates createMeshs, getMeshs, updateMeshs, deleteMeshs, listMeshs

// All operations preserve complete type information
await tool.createRigControls.execute({
  name: "arm_ctrl",          
  shape: "cube",            // TypeScript error if not a valid enum value
  targetJointIds: ["joint1"], // Must be string array
  color: [0.2, 0.4, 1],     // Must match Color schema format
  // IDE autocomplete shows all required/optional fields
});
```

Entity schemas provide:
- **Schema Validation**: Runtime parameter checking with detailed error messages
- **Type Information**: Complete TypeScript types for IDE assistance
- **Documentation**: Self-documenting API with descriptions
- **Code Generation**: Templates for platform-specific implementations

### 2. Compound Tool Architecture

The system creates a clear separation between atomic and compound operations:

```typescript
// From compounded.ts - Higher level operations composed from atomic operations
createIKFKSwitch: defineCompoundTool({
  // ...parameter and return definitions...
  execute: async (params) => {
    // Create IK chain using atomic operations
    const ikChainResult = await tool.createIKChains.execute({/*...*/});
    
    // Create control with full type-checking
    const ikControlResult = await tool.createRigControls.execute({
      name: `${switchName}_IK_CTRL`,
      shape: ikControlShape,  // Type-checked against schema
      targetJointIds: [jointIds[jointIds.length - 1]],
      color: ikColor,
      // ...other parameters
    });
    
    // Position the control at the end effector
    await tool.batchTransform.execute({/*...*/});
    
    // Create constraints to connect the system
    await tool.createConstraint.execute({/*...*/});
    
    // Return standardized response with created IDs
    return {
      success: true,
      switchControlId: switchControlResult.id,
      ikControlId: ikControlResult.id,
      fkControlIds,
      poleVectorId: poleVectorId || undefined,
    };
  }
})
```

This architecture provides several technical advantages:

1. **Atomic Operations** (~20% of the system):
   - Directly interact with platform APIs
   - Need platform-specific implementations
   - Focus on single entity operations (create, read, update, delete)
   - Form minimal implementation required for new platforms

2. **Compound Operations** (~80% of the system):
   - Built entirely from atomic operations
   - Zero platform-specific code
   - Implement higher-level domain concepts
   - Work on any platform without modification

### 3. Code Generation Pipeline

The system automatically generates platform-specific implementations from TypeScript definitions:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│ Entity Schemas  │     │ Schema          │     │ Platform-Specific Code  │
│ & Tools (TS)    │ ──> │ Extraction (TS) │ ──> │ (Python/C++/etc.)       │
└─────────────────┘     └─────────────────┘     └─────────────────────────┘
```

Key aspects of the generation system:
- **Entity Extraction**: Analyzes Zod schemas to understand entity structure
- **Parameter Mapping**: Converts TypeScript types to platform-native types
- **Validation Generation**: Creates parameter validation in target languages
- **Implementation Templates**: Provides platform-specific code patterns

### 4. Domain Organization

The system is organized into domains that mirror 3D content creation workflows:

- **Core**: Base entities and operations used across all domains
- **Modeling**: Mesh creation, editing, and topology operations
- **Animation**: Keyframes, curves, clips, and animation control
- **Rigging**: Skeletal systems, controls, and deformation
- **Rendering**: Materials, lights, and render settings

Each domain follows the same organizational pattern:
- `entity.ts`: Domain-specific entity definitions
- `atomic.ts`: Atomic operations for domain entities
- `compounded.ts`: Higher-level operations built from atomic tools

## Getting Started

```bash
# Install dependencies
bun install

# Run the server
bun run index.ts

# Extract schemas and generate plugins
bun run packages/scripts/plugin-codegen.ts
```

## Development Workflow

1. **Define Entities**: Create or extend entity schemas in `src/tool/<domain>/entity.ts`
2. **Generate CRUD**: Use `createCrudOperations` to generate atomic operations
3. **Create Compound Tools**: Build higher-level operations from atomic tools
4. **Generate Plugins**: Run the code generator to create platform-specific implementations

## Contributing

The architectural decisions in 3D-MCP make it uniquely extensible:

1. **Add New Entities**: Define new entities and automatically get CRUD operations
2. **Add New Compound Tools**: Combine existing atomic operations to create new functionality
3. **Add New Platforms**: Implement the atomic tool in plug-in to support all functionality


---

*3D-MCP: One API to rule all 3D software*