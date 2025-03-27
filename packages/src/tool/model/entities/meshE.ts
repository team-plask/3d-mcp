import { z } from "zod";
import { TransformC } from "../../scene/components/transformC";
import { MeshC } from "../../scene/components/meshC";
import { HierarchyC } from "../../scene/components/hierarchyC";

export const MeshE = z
  .object({
    transform: TransformC,
    mesh: MeshC,
    hierarchy: HierarchyC,
  })
  .describe("Mesh entity");
