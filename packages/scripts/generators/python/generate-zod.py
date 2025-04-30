import json
import re
import os

# File paths
json_file_path = "./output.json"
patch_file_path = "./output-patch.json"
output_ts_file_path = "./geo-node-types.generated.ts"

# Read the JSON file
with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Apply patch if it exists
if os.path.exists(patch_file_path):
    with open(patch_file_path, "r", encoding="utf-8") as patch_file:
        patch_data = json.load(patch_file)

    # Merge patch data into the original JSON data
    for key, patch_value in patch_data.items():
        if key in json_data:
            # Update fields in the existing key
            json_data[key].update(patch_value)
        else:
            # Add new keys from the patch
            json_data[key] = patch_value


def transform_default_value(default_value):
    """
    Transform the default_value field based on the specified rules:
    """
    if default_value is None:
        return None

    # Match integers
    if re.match(r"^\d+$", default_value):
        return default_value

    # Match floats (e.g., 3f or 3.f)
    float_match = re.match(r"^-?\d+(\.\d+)?f?$", default_value)
    if float_match:
        value = default_value.rstrip("f")  # Remove the trailing 'f'
        if value.endswith("."):
            return value.rstrip(".")
        if value.endswith(".0"):
            return value[:-2]
        return value  # Return as is if it's a whole number

    # Match vectorN(x)
    vector_match = re.match(r"^float(\d+)\(([^)]+)$", default_value)
    if vector_match:
        n = int(vector_match.group(1))  # Number of elements in the vector
        x = vector_match.group(2)      # Value to repeat
        return f"[{', '.join([transform_default_value(x)] * n)}]"

    # Return the default_value as is if no transformation is applied
    return default_value


def generate_input_output_code(items, is_output=False):
    zod_type_map = {
        "Int": "z.number().int()",
        "Float": "z.number()",
        "String": "z.string()",
        "Bool": "z.boolean()",
        "Vector": "z.array(z.number())",
    }
    code = []
    for item in items:
        if is_output and not item.get("configurable"):
            continue
        item_name = item["name"]
        item_description = item["description"]
        item_alias = item.get("alias")
        if item_alias:
            item_name = item_alias
        # Spaces are invalid in MCP tools, replace spaces with "__" and "_" with "\_"
        item_name = item_name.replace("_", "\\_").replace(" ", "__")
        item_type = item["type"].replace("decl::", "")
        zod_type = zod_type_map.get(item_type, "z.unknown()")

        if zod_type == "z.unknown()":
            continue
        # Transform the default_value
        default_value = transform_default_value(
            item.get("default_value"))
        default_value_code = f".default({default_value})" if default_value else ""

        code.append(
            f'    "{item_name}": {zod_type}.optional(){default_value_code}.describe("{item_description}. Type : {item_type}")'
        )
    return ",\n".join(code)


def generate_ts_code(json_data):
    ts_code = """import { z } from "zod";\n\n"""
    ts_code += "// Auto-generated file. Do not edit manually.\n\n"

    all_types_code = []
    for key, value in json_data.items():
        inputs_object = generate_input_output_code(value["inputs"])
        outputs_object = generate_input_output_code(value["outputs"], True)

        all_types_code.append(
            f"""z.object({{
  type: z.literal("{value['category']}{value['struct_name']}"),
  inputs: z.object({{
{inputs_object}
  }}),
  outputs: z.object({{
{outputs_object}
}})
}})"""
        )

    if len(all_types_code) > 1:
        union_code = ",\n".join(all_types_code)
        ts_code += f"""export const blNodeType = z.union([
{union_code}
]);\n"""
    elif len(all_types_code) == 1:
        ts_code += f"""export const blNodeType = {all_types_code[0]};\n"""
    else:
        ts_code += "export const blNodeType = z.never(); // Handle the case where there are no types\n"

    return ts_code


# Generate the TypeScript code
ts_code = generate_ts_code(json_data)

# Write the TypeScript code to a file
with open(output_ts_file_path, "w", encoding="utf-8") as ts_file:
    ts_file.write(ts_code)

print(f"TypeScript file generated at {output_ts_file_path}")
