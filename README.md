# 3D MCP

![Plugin Tests](https://github.com/team-plask/3d-mcp/workflows/Plugin%20Code%20Generation%20Tests/badge.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue) ![License](https://img.shields.io/badge/License-Apache_2.0-green)

## Overview

3D-MCP is a universal implementation of the [Model Context Protocol](https://modelcontextprotocol.io/introduction) for 3D software. It creates a unified TypeScript interface for LLM that automatically generates native plugins for Blender, Maya, Unreal Engine, and other 3D applications.

```typescript
// LLM uses the same interface to work across any 3D software
await tools.animation.createKeyframe({
  objectId: "cube_1",
  property: "rotation.x",
  time: 30,
  value: Math.PI/2
});
```

## Why 3D-MCP?

| Problem | Solution | Implementation |
|---------|----------|----------------|
| **Fragmentation** | Single API for all 3D software | Abstract interfaces with auto-generated native plugins |
| **Complexity** | High-level semantic operations | Compound tools built from atomic operations. After we cover the atomic tools for a plug-in, no need for additional plug-in development. |
| **Development Cost** | Write once, run everywhere | Schema-driven code generation for Python, C++, etc. |

## Technical Architecture

### 1. Abstract Tool System

Tools are organized by domain and implemented as TypeScript classes with Zod schemas:

```typescript
// src/tool/animation/createKeyframe.ts
export const createKeyframeSchema = z.object({
  objectId: z.string(),
  property: z.string(),
  time: z.number(),
  value: z.number()
});

export class CreateKeyframeTool implements Tool {
  async execute(params: z.infer<typeof createKeyframeSchema>) {
    // Implementation delegates to the appropriate plugin
  }
}
```

### 2. Code Generation Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│ Abstract Tool   │     │ Schema          │     │ Target-specific Code    │
│ Definition (TS) │ ──> │ Extraction (TS) │ ──> │ (Python/C++/etc.)       │
└─────────────────┘     └─────────────────┘     └─────────────────────────┘
```

The system automatically:
1. Extracts Zod schemas from tool definitions
2. Generates type-safe implementations in target languages
3. Handles parameter validation and error handling
4. Provides native implementations for each DCC tool

### 3. Cross-Platform Implementation

Each DCC tool gets native code that feels idiomatic:

```python
# Generated Blender plugin from the same interface
def create_keyframe(object_id, property, time, value):
    obj = bpy.data.objects.get(object_id)
    if not obj:
        return {"error": f"Object {object_id} not found"}
    obj.keyframe_insert(data_path=property, frame=time)
    return {"success": True}
```

```cpp
// Generated Unreal Engine plugin from the same interface
bool UAnimationTools::CreateKeyframe(FString ObjectId, FString Property, 
                                    float Time, float Value) {
    UObject* Object = FindObject<UObject>(nullptr, *ObjectId);
    if (!Object) return false;
    // Unreal-specific implementation
    return true;
}
```

### 4. Atomic and Compound Tool Architecture

The system implements the dependency inversion principle through a two-tier architecture:

- **Atomic Tools**: Fundamental operations that require DCC-specific implementations. These are the only components that need native code generation for each target platform.

- **Compound Tools**: Higher-level operations composed entirely from atomic tools. These tools are completely platform-agnostic, requiring **zero additional implementation** when supporting new 3D applications.

```typescript
// Example of a compound tool that works across all platforms
const blendAnimations = defineCompoundTool({
  description: "Create a smooth transition blend between two animations",
  parameters: blendAnimationsParams,
  returns: blendAnimationsReturns,
  execute: async (params) => {
    // Uses atomic tools that already have platform-specific implementations
    const layer = await tools.animation.createLayer({ name: params.blendLayerName });
    await tools.animation.addClipToLayer({ layerId: layer.id, clipId: params.fromClipId });
    // Additional atomic operations to implement the blending...
    return { layerId: layer.id, success: true };
  }
});
```

This architecture provides significant scalability advantages:

1. **Linear Growth**: Only atomic tools need concrete implementations, while compound tools scale without additional platform-specific code.
2. **Interface Stability**: Compound tools depend only on atomic tool interfaces, not implementations.
3. **Reduced Development Burden**: Once atomic tools are implemented for a DCC, all existing compound tools work automatically.

## Getting Started

### Quick Start

```bash
# Install dependencies
bun install

# Run the server
bun run index.ts

# Extract schemas and generate plugins
bun run packages/scripts/plugin-codegen.ts
```

### Development Workflow

1. Define abstract tools with Zod schemas in `src/tool/`
2. Run schema extraction with `bun run packages/scripts/extract-schemas.ts`
3. Generate plugins with `bun run packages/scripts/plugin-codegen.ts`
4. Use the tools via the MCP server

## Key Features

### Animation Tools
- Create and modify keyframes with precise timing control
- Build animation curves with easing and interpolation
- Retarget animations between different character rigs

### Rendering Tools
- Configure materials with PBR properties
- Set up lighting environments
- Control render parameters (quality, resolution, passes)

## Contributing

### Why It's Easy to Contribute

1. **Add New Tools**: Define a new abstract tool with a Zod schema, and the code generation system automatically produces implementations for all supported DCCs.

2. **Add New DCCs**: Implement a new code generator for a target language or platform, and all existing tools get implementations for free.

3. **Clear Development Model**: The separation of abstract interfaces from concrete implementations makes the system easy to extend without breaking existing functionality.

---

*3D-MCP: One API to rule all 3D software*