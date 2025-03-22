import { existsSync, mkdirSync } from "fs";

/**
 * Ensure a directory exists, creating it if it doesn't
 */
export function ensureDirectoryExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}
