import re
import json


def parse_zod_union(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Extract all objects in the zod union
    pattern = re.compile(r'z\.object\(\{.*?\}\)', re.DOTALL)
    matches = pattern.findall(content)

    tools = []

    for match in matches:
        # Extract the type
        type_match = re.search(r'type: z\.literal\("([^"]+)"\)', match)
        tool_name = type_match.group(1) if type_match else "UnknownTool"

        # Extract inputs
        inputs_match = re.search(
            r'inputs: z\.object\((\{.*?\})\)', match, re.DOTALL)
        inputs = inputs_match.group(1) if inputs_match else "{}"

        tools.append({
            "toolName": tool_name,
            "description": "tool description",
            "parameters": inputs,
            "returns": "_OperationResponse.extend({ nodeId: z.string() })",
        })

    return tools


def generate_mcp_tools(tools, output_file):
    with open(output_file, 'w') as file:
        for tool in tools:
            file.write(f"add{tool['toolName']}: {{\n")
            file.write(f"  description: '{tool['description']}',\n")
            file.write(f"  parameters: z.object({tool['parameters']}),\n")
            file.write(f"  returns: {tool['returns']},\n")
            file.write("},\n\n")


if __name__ == "__main__":
    input_file = r"e:\3d-mcp\packages\scripts\generators\python\geo-node-types.generated.ts"
    output_file = r"e:\3d-mcp\packages\scripts\generators\python\generated_mcp_tools.js.template"

    tools = parse_zod_union(input_file)
    generate_mcp_tools(tools, output_file)

    print(f"MCP tools generated in {output_file}")
