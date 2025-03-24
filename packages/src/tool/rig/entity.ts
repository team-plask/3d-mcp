import { z } from "zod";
import {
  BaseEntity,
  Tensor,
  NodeBase,
  Color,
  IKChain,
  Joint,
  BlendShape,
  Constraint,
  Pose,
} from "../core/entity";

export const RigEntities = {
  Joint,
  Constraint,
  IKChain,
  BlendShape,
} as const;
