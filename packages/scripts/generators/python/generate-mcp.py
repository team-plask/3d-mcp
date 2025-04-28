import re
import json


def parse_zod_union(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Extract all objects in the zod union
    pattern = re.compile(
        r'^z\.object\(\{.*?\btype: z\.literal\("([^"]+)"\).*?inputs: z\.object\((\{.*?\})\).*?outputs: z\.object\((\{.*?\})\).*?\}\)',
        re.DOTALL | re.MULTILINE
    )
    matches = pattern.findall(content)

    tools = []

    for match in matches:
        tool_name = match[0]
        inputs = match[1]
        outputs = match[2]

        # Combine inputs and outputs


def parse_zod_union(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Extract all objects in the zod union
    pattern = re.compile(
        r'^z\.object\(\{.*?\btype: z\.literal\("([^"]+)"\).*?inputs: z\.object\((\{.*?\})\).*?outputs: z\.object\((\{.*?\})\).*?\}\)',
        re.DOTALL | re.MULTILINE
    )
    matches = pattern.findall(content)

    tools = []

    for match in matches:
        tool_name = match[0]
        inputs = match[1]
        outputs = match[2]

        # Combine inputs and outputs
        stripped_inputs = inputs.replace("\n", "").replace(" ", "")
        stripped_outputs = outputs.replace("\n", "").replace(" ", "")
        combined_parameters = f"{inputs[:-1]}, {outputs[1:]}" if stripped_inputs != "{}" and stripped_outputs != "{}" else (
            inputs if stripped_outputs == "{}" else outputs)

        tools.append({
            "toolName": tool_name,
            "description": f"Adds a {tool_name} node to the graph.",
            "parameters": combined_parameters,
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
