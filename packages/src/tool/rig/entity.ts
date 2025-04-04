import { z } from "zod";
import {
  Joint,
  BlendShape,
  Constraint,
  Pose,
} from "../core/entity";

export const RigEntities = {
  Joint,
  Constraint,
  BlendShape,
} as const;
