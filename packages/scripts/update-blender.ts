import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import archiver from "archiver";

// Configuration
const BLENDER_PATH =
  process.env.BLENDER_PATH ||
  "/Applications/Blender.app/Contents/MacOS/Blender";
const PLUGIN_DIR = path.resolve(
  __dirname,
  "../plugins/blender"
);
const OUTPUT_ZIP = path.resolve(
  __dirname,
  "../plugins/blender.zip"
);

async function zipPlugin(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Creating zip from ${PLUGIN_DIR}...`);

    // Create a file to stream archive data to
    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Highest compression level
    });

    // Listen for errors
    archive.on("error", (err) => {
      console.error(`Error creating zip: ${err.message}`);
      reject(err);
    });

    // Listen for close event
    output.on("close", () => {
      const fileSize = archive.pointer();
      console.log(
        `Archive created: ${OUTPUT_ZIP} (${(
          fileSize / 1024
        ).toFixed(2)} KB)`
      );
      resolve(OUTPUT_ZIP);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add the directory contents to the archive
    archive.directory(
      PLUGIN_DIR,
      path.basename(PLUGIN_DIR)
    );

    // Finalize the archive
    archive.finalize();
  });
}

async function updateBlenderAddon(
  zipPath: string
): Promise<void> {
  // Create Python script for Blender to execute
  const pythonScript = `
import bpy
import os
import sys
import shutil
import re
import addon_utils

print("Starting Blender addon update")

# Debug - check addon paths and installed addons
addon_dir = bpy.utils.user_resource('SCRIPTS', path="addons")
print(f"Addon directory: {addon_dir}")
print("Currently installed addons:")
for addon in bpy.context.preferences.addons:
    print(f" - {addon.module}")

# First, find and remove any existing 3D-MCP addon
print("Searching for existing 3D-MCP addon...")
found_addons = []

# Method 1: Search by content in __init__.py
for item in os.listdir(addon_dir):
    item_path = os.path.join(addon_dir, item)
    if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, "__init__.py")):
        bl_info_path = os.path.join(item_path, "__init__.py")
        try:
            with open(bl_info_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                # Look for multiple potential identifiers
                if "3D-MCP" in content or "3DMCP" in content or "MCP" in content and "bl_info" in content:
                    found_addons.append(item)
                    print(f"Found potential 3D-MCP addon through content: {item}")
        except Exception as e:
            print(f"Error reading init file: {e}")

# Method 2: Check currently enabled addons
for addon in bpy.context.preferences.addons:
    # Check if addon name contains MCP-related strings
    if "mcp" in addon.module.lower() or "3d-mcp" in addon.module.lower() or "3dmcp" in addon.module.lower():
        if addon.module not in found_addons:
            found_addons.append(addon.module)
            print(f"Found potential 3D-MCP addon through addon list: {addon.module}")

# Method 3: Check for MCP operators in Blender
has_mcp_ops = hasattr(bpy.ops, "mcp")
if has_mcp_ops:
    print("Found MCP operators in Blender - addon is currently installed")
    # Try to find the addon module that provides these operators
    for addon in bpy.context.preferences.addons:
        try:
            mod = sys.modules.get(addon.module)
            if mod and hasattr(mod, "register") and hasattr(mod, "unregister"):
                # Check if this module has 'mcp' in its attributes
                if hasattr(mod, "mcp") or "mcp" in str(mod).lower():
                    if addon.module not in found_addons:
                        found_addons.append(addon.module)
                        print(f"Found MCP addon through operator inspection: {addon.module}")
        except:
            pass

# Clean up all found addons
if not found_addons:
    print("No existing 3D-MCP addons found")
else:
    print(f"Found {len(found_addons)} potential 3D-MCP addons to remove")
    for addon_name in found_addons:
        # First properly unregister the addon
        try:
            if addon_name in {a.module for a in bpy.context.preferences.addons}:
                print(f"Disabling addon: {addon_name}")
                bpy.ops.preferences.addon_disable(module=addon_name)
                print(f"Successfully disabled {addon_name}")
                
                # Try to unregister it via addon_utils as well
                try:
                    addon_utils.disable(addon_name, default_set=True)
                    print(f"Also disabled via addon_utils: {addon_name}")
                except:
                    pass
                    
                # Force unload the module if it's in sys.modules
                if addon_name in sys.modules:
                    try:
                        mod = sys.modules[addon_name]
                        if hasattr(mod, "unregister"):
                            mod.unregister()
                        del sys.modules[addon_name]
                        print(f"Forcefully unloaded module: {addon_name}")
                    except Exception as e:
                        print(f"Error unloading module {addon_name}: {e}")
        except Exception as e:
            print(f"Error disabling addon {addon_name}: {e}")
            
        # Remove the addon folder
        try:
            addon_path = os.path.join(addon_dir, addon_name)
            if os.path.exists(addon_path):
                if os.path.isdir(addon_path):
                    print(f"Removing addon directory: {addon_path}")
                    shutil.rmtree(addon_path)
                else:
                    print(f"Removing addon file: {addon_path}")
                    os.remove(addon_path)
                print(f"Successfully removed {addon_name}")
            else:
                print(f"Addon path {addon_path} not found")
        except Exception as e:
            print(f"Error removing addon files {addon_name}: {e}")

# Manual workaround for common addon names and locations
manual_check_names = ['3D-MCP']
for name in manual_check_names:
    test_path = os.path.join(addon_dir, name)
    if os.path.exists(test_path):
        try:
            print(f"Found potential addon directory by name: {name}")
            if os.path.isdir(test_path):
                shutil.rmtree(test_path)
            else:
                os.remove(test_path)
            print(f"Removed: {test_path}")
        except Exception as e:
            print(f"Failed to remove {test_path}: {e}")

# Clean Blender's addon cache in the user preferences directory
print("Cleaning Blender addon cache...")
cache_dir = bpy.utils.user_resource('CONFIG')
cache_files = ['userpref.blend', 'startup.blend']
for cache_file in cache_files:
    cache_path = os.path.join(cache_dir, cache_file)
    if os.path.exists(cache_path):
        try:
            # Create a backup just in case
            backup_path = f"{cache_path}.backup"
            if os.path.exists(backup_path):
                os.remove(backup_path)
            shutil.copy2(cache_path, backup_path)
            print(f"Created backup of {cache_file}")
        except Exception as e:
            print(f"Failed to backup {cache_file}: {e}")

# Install the new addon
print(f"Installing addon from: {os.path.basename('${zipPath}')}") 
bpy.ops.preferences.addon_install(filepath="${zipPath.replace(
    /\\/g,
    "\\\\"
  )}")

# After installation, list the new addons to find what was added
print("Addons after installation:")
all_addons = set()
for addon in bpy.context.preferences.addons:
    all_addons.add(addon.module)
    print(f" - {addon.module}")

# List files in addon directory to find our newly installed addon
print(f"Contents of addon directory after installation:")
for item in os.listdir(addon_dir):
    full_path = os.path.join(addon_dir, item)
    is_dir = os.path.isdir(full_path)
    has_init = is_dir and os.path.exists(os.path.join(full_path, "__init__.py"))
    print(f" - {item} {'[DIR+INIT]' if has_init else '[DIR]' if is_dir else '[FILE]'}")

# Look for our addon - it should be a directory with __init__.py
potential_addons = []
for item in os.listdir(addon_dir):
    if os.path.isdir(os.path.join(addon_dir, item)) and os.path.exists(os.path.join(addon_dir, item, "__init__.py")):
        bl_info_path = os.path.join(addon_dir, item, "__init__.py")
        try:
            with open(bl_info_path, "r", encoding="utf-8") as f:
                content = f.read()
                if "3D-MCP" in content or "3DMCP" in content:
                    potential_addons.append(item)
                    print(f"Found our addon: {item}")
        except Exception as e:
            print(f"Error reading {bl_info_path}: {e}")

if not potential_addons:
    print("WARNING: Could not find the installed addon!")
else:
    # Try to enable each potential addon
    for module_name in potential_addons:
        try:
            print(f"Enabling addon: {module_name}")
            # Enable via both methods to be sure
            addon_utils.enable(module_name, default_set=True)
            bpy.ops.preferences.addon_enable(module=module_name)
            print(f"Successfully enabled {module_name}")
            
            # Restart the server if it was running
            if hasattr(bpy.context.scene, "mcp_server_running") and bpy.context.scene.mcp_server_running:
                print("Restarting MCP server...")
                bpy.ops.mcp.stop_server()
                bpy.ops.mcp.start_server()
                print("MCP server restarted")
        except Exception as e:
            print(f"Error enabling {module_name}: {e}")
    
    # Force a full save of user preferences to ensure addon stays enabled
    print("Saving user preferences...")
    bpy.ops.wm.save_userpref()
    
    # One more comprehensive check to make sure addon is properly loaded
    print("Performing final validation checks...")
    for module_name in potential_addons:
        if module_name in {addon.module for addon in bpy.context.preferences.addons}:
            print(f"Confirmed: {module_name} is properly registered in Blender addons")
        else:
            print(f"Warning: {module_name} did not register properly")
            
        # Check if it's properly loaded in sys.modules
        if module_name in sys.modules:
            print(f"Confirmed: {module_name} is properly loaded in Python modules")
        else:
            print(f"Warning: {module_name} is not loaded in Python modules")

print("Addon update process completed")
`;

  const scriptPath = path.resolve(
    __dirname,
    "blender_update_script.py"
  );
  fs.writeFileSync(scriptPath, pythonScript);

  // Run Blender with the script
  console.log("Launching Blender to update addon...");
  return new Promise((resolve, reject) => {
    exec(
      `${BLENDER_PATH} --background --python ${scriptPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(
            `Error updating Blender addon: ${error.message}`
          );
          console.log("Blender output:", stdout);
          reject(error);
          return;
        }

        console.log(stdout);
        if (stderr) console.error(stderr);

        // Clean up script file
        fs.unlinkSync(scriptPath);

        console.log("Blender addon update completed!");
        resolve();
      }
    );
  });
}

async function main() {
  try {
    const zipPath = await zipPlugin();
    await updateBlenderAddon(zipPath);
  } catch (error) {
    console.error("Failed to update Blender addon:", error);
    process.exit(1);
  }
}

// Run the script
main();
