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

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             LLM / User API                              │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ MCP Tool API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Compound Operations                            │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Modeling Tools  │  │ Animation Tools │  │ Rigging Tools           │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ Implemented by
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           Atomic Operations                             │
│                                                                         │
│  ┌─────────── Entity CRUD ────────────┐ ┌────────── Non-CRUD ─────────┐ │ 
│  │ create{Entity}s update{Entity}s ...│ │  select, undo, redo, etc.   │ │  
│  └────────────────────────────────────┘ └─────────────────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ Plug-in Server Request
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Platform-Specific Adapters                        │
│                                                                         │
│  ┌──── Blender ────┐  ┌────── Maya ─────┐  ┌─── Unreal Engine ────┐     │
│  │ createKeyframes │  │ createKeyframes │  │ createKeyframes      │     │    
│  └─────────────────┘  └─────────────────┘  └──────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

## Why These Design Decisions?

**Entity-First Design** was chosen because:
- 3D applications use different object models but share core concepts (meshes, materials, animations)
- Zod schemas provide single-source-of-truth for validation, typing, and documentation
- Strong typing catches errors at compile time rather than runtime
- Rich metadata enables better AI understanding of domain objects

**CRUD Operations as Foundation** because:
- They map cleanly to what 3D applications need to do with entities
- Standardized patterns reduce cognitive overhead
- Auto-generation eliminates repetitive code using `createCrudOperations`
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

#### Entity Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                Core Entity Definitions                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ BaseEntity  │  │ NodeBase    │  │ Other Core Entities │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           ▲
                           │ extends
                           │
┌──────────────────────────────────────────────────────────────┐
│                Domain-Specific Entities                      │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │
│  │ Model       │  │ Animation   │  │ Rigging             │   │
│  │ Entities    │  │ Entities    │  │ Entities            │   │
│  └─────────────┘  └─────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ input to
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                Automatic CRUD Generation                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ createCrudOperations(Entities)                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ generates
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     Atomic Operations                        │
│                                                              │
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐    │
│  │ create{Entity}s │ │ get{Entity}s │ │ update{Entity}s │ .. │
│  └─────────────────┘ └──────────────┘ └─────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                           │
                           │ foundation for
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    Compound Operations                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ No need for platform-specific code. Use atomic ops only.│ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```


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

#### Tool Composition Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        High-Level Tool Definition                       │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Compound Tool Pattern                           │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ defineCompoundTool({                                             │   │
│  │   description: string,                                           │   │
│  │   parameters: zod.Schema,                                        │   │
│  │   returns: zod.Schema,                                           │   │
│  │   execute: async (params) => {                                   │   │
│  │     // Composed entirely from atomic operations                  │   │
│  │     await tool.atomicOperation1.execute({...});                  │   │
│  │     await tool.atomicOperation2.execute({...});                  │   │
│  │     return { success: true, ...results };                        │   │
│  │   }                                                              │   │
│  │ })                                                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ Plug-in Server Request
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Platform Adaptation                             │
│                                                                         │
│  ┌──────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Blender Implementation   │  │ Maya Implementation                 │  │
│  │ of Atomic Operations     │  │ of Atomic Operations                │  │
│  └──────────────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

Key files for the compound tool architecture:
- compounded.ts: Compound modeling tools
- compounded.ts: Compound animation tools
- compounded.ts: Compound rigging tools

### 3. Code Generation Pipeline

The system automatically generates platform-specific implementations from TypeScript definitions:

```
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────────────┐
│ Entity Schemas  │     │ Schema             │     │ Platform-Specific Code  │
│ & Tools (TS)    │ ──> │ Extraction (TS)    │ ──> │ (Python/C++/etc.)       │
└─────────────────┘     └────────────────────┘     └─────────────────────────┘
      │                        │                             │
      │                        │                             │
      ▼                        ▼                             ▼
┌─────────────────┐     ┌────────────────────┐     ┌─────────────────────────┐
│ Type            │     │ Parameter          │     │ Implementation          │
│ Definitions     │     │ Validation         │     │ Templates               │
└─────────────────┘     └────────────────────┘     └─────────────────────────┘
```

Key aspects of the generation system:
- **Entity Extraction**: Analyzes Zod schemas to understand entity structure
- **Parameter Mapping**: Converts TypeScript types to platform-native types
- **Validation Generation**: Creates parameter validation in target languages
- **Implementation Templates**: Provides platform-specific code patterns

The codegen system is implemented in:
- [plugin-codegen.ts](./packages/scripts/plugin-codegen.ts): Main code generation script
- [extract-schemas.ts](./packages/scripts/extract-schemas.ts): Extracts Zod schemas from TypeScript files into temporary JSON files.

### 4. Domain Organization

The system is organized into domains that mirror 3D content creation workflows:

- **Core**: Base entities and operations used across all domains
- **Modeling**: Mesh creation, editing, and topology operations
- **Animation**: Keyframes, curves, clips, and animation control
- **Rigging**: Skeletal systems, controls, and deformation
- **Rendering**: Materials, lights, and render settings

Each domain follows the same organizational pattern:
- [`entity.ts`](./packages/src/tool/animation/entity.ts): Domain-specific entity definitions
- [`atomic.ts`](./packages/src/tool/animation/atomic.ts): Atomic operations for domain entities
- [`compounded.ts`](./packages/src/tool/animation/compounded.ts): Higher-level operations built from atomic tools

#### Domain Structure Diagram

```
packages/src/tool/
│
├── core/                  # Core shared components
│   ├── entity.ts          # Base entities all domains use
│   ├── utils.ts           # Shared utilities including CRUD generation
│   └── ...
│
├── model/                 # Modeling domain
│   ├── entity.ts          # Mesh, Vertex, Face, etc.
│   ├── atomic.ts          # Atomic modeling operations
│   ├── compounded.ts      # Higher-level modeling tools
│   └── ...
│
├── animation/             # Animation domain
│   ├── entity.ts          # Keyframe, AnimCurve, Clip, etc.
│   ├── atomic.ts          # Atomic animation operations
│   ├── compounded.ts      # Higher-level animation tools
│   └── ...
│
├── rig/                   # Rigging domain
│   ├── entity.ts          # Joint, IKChain, Control, etc.
│   ├── atomic.ts          # Atomic rigging operations
│   ├── compounded.ts      # Higher-level rigging tools
│   └── ...
│
└── rendering/             # Rendering domain
    ├── entity.ts          # Camera, Light, RenderSettings, etc.
    ├── atomic.ts          # Atomic rendering operations
    ├── compounded.ts      # Higher-level rendering tools
    └── ...
```

### 5. Entity-Centric CRUD Architecture

The system implements a sophisticated entity-centric approach where:

1. **Entities as Domain Models**: Each domain (modeling, animation, rigging) defines its core entities that represent its fundamental concepts. These are implemented as Zod schemas with rich type information.

2. **CRUD as Foundation**: Every entity automatically receives a complete set of CRUD operations (Create, Read, Update, Delete) through the `createCrudOperations` utility:

```typescript
// Each domain starts with CRUD operations for all its entities
const entityCruds = createCrudOperations(ModelEntities);

const modelAtomicTools = {
  ...entityCruds,  // Foundation of all atomic tools
  // Domain-specific operations build on this foundation
}
```

3. **Entity Reuse and Inheritance**: Core entities defined in `core/entity.ts` are extended by domain-specific entities, promoting code reuse and consistent design across domains.

4. **DDD-Inspired Architecture**: The system follows Domain-Driven Design principles by organizing code around domain entities and aggregates rather than technical concerns.

This architecture provides several key benefits:

- **Consistency**: All entities have the same patterns for basic operations
- **Reduced Boilerplate**: CRUD operations are generated automatically  
- **Clear Organization**: Tools are organized around domain entities
- **Separation of Concerns**: Each domain manages its own entities while sharing common patterns

The combination of rich entity models with automatic CRUD operations creates a robust foundation that simplifies development while maintaining flexibility for domain-specific operations.

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
3. **Add New Platforms**: Implement the atomic tool interfaces in a new plugin

See our contributing guide for more details on how to contribute.

---

*3D-MCP: One API to rule all 3D software*