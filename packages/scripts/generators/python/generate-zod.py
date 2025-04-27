import json

# File paths
json_file_path = "./output.json"
output_ts_file_path = "./geo-node-types.generated.ts"

# Read the JSON file
with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Generate the TypeScript code


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
            input_type = input_item["type"].replace("decl::", "")
            zod_type = zod_type_map.get(input_type, "z.unknown()")
            inputs_code.append(
                f'    "{input_name}": {zod_type}.optional().describe("{input_description}. Type : {input_type}")'
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
