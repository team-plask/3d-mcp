import { z } from "zod";

/**
 * Interpolation types for animation and curves
 */
export const InterpolationType = z.enum([
  "linear", // Linear interpolation
  "step", // Discrete step function
  "bezier", // Cubic Bezier curve
  "hermite", // Hermite spline
  "catmull", // Catmull-Rom spline
  "constant", // No interpolation (hold value)
]);

/**
 * Extrapolation behaviors for curves
 */
export const ExtrapolationType = z.enum([
  "constant", // Hold last/first value
  "linear", // Continue linear trend
  "cycle", // Repeat from beginning
  "cycleWithOffset", // Repeat with offset
  "oscillate", // Ping-pong back and forth
]);
