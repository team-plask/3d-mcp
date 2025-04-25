import json
import re
# File paths
json_file_path = "./output.json"
output_ts_file_path = "./geo-node-types.generated.ts"

# Read the JSON file
with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Generate the TypeScript code

# Generate the TypeScript code


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
    float_match = re.match(r"^\d+(\.\d+)?f?$", default_value)
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


def generate_ts_code(json_data):
    zod_type_map = {
        "Int": "z.number().int()",
        "Float": "z.number()",
        "String": "z.string()",
        "Bool": "z.boolean()",
        "Vector": "z.array(z.number())",
    }
    ts_code = """import { z } from "zod";\n\n"""
    ts_code += "// Auto-generated file. Do not edit manually.\n\n"

    all_types_code = []
    for key, value in json_data.items():
        inputs_code = []
        for input_item in value["inputs"]:
            input_name = input_item["name"]
            input_description = input_item["description"]
            input_alias = input_item.get("alias")
            if input_alias:
                input_name = input_alias
            input_type = input_item["type"].replace("decl::", "")
            zod_type = zod_type_map.get(input_type, "z.unknown()")

            if zod_type == "z.unknown()":
                continue
            # Transform the default_value
            default_value = transform_default_value(
                input_item.get("default_value"))
            default_value_code = f".default({default_value})" if default_value else ""

            inputs_code.append(
                f'    "{input_name}": {zod_type}.optional(){default_value_code}.describe("{input_description}. Type : {input_type}")'
            )
        inputs_object = ",\n".join(inputs_code)
        all_types_code.append(
            f"""z.object({{
  type: z.literal("{value['category']}{value['struct_name']}"),
  inputs: z.object({{
{inputs_object}
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
