import re
import json


def parse_tools(file_path):
    """
    Parse the TypeScript file and extract tool types and their details.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regular expression to match z.object definitions
    pattern = re.compile(
        r'z\.object\(\{\s*type: z\.literal\("([^"]+)"\).*?inputs: z\.object\((\{.*?\})\).*?outputs: z\.object\((\{.*?\})\)',
        re.DOTALL
    )
    matches = pattern.findall(content)

    tools = {}

    for match in matches:
        tool_type = match[0]
        inputs = match[1].strip()
        outputs = match[2].strip()

        # Clean up inputs and outputs
        inputs = inputs if inputs != "{}" else None
        outputs = outputs if outputs != "{}" else None

        tools[tool_type] = {
            "inputs": inputs,
            "outputs": outputs
        }

    return tools


def generate_python_file(tools, output_file):
    """
    Generate a Python file containing a dictionary of tools.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write("# Auto-generated file. Do not edit manually.\n\n")
        file.write("tools = {\n")
        for tool_type, details in tools.items():
            file.write(f"    \"{tool_type}\": {{\n")
            file.write(f"        \"callback\": None,\n")
            file.write("    },\n")
        file.write("}\n")


if __name__ == "__main__":
    # Input TypeScript file
    input_file = r"./geo-node-types.generated.ts"
    # Output Python file
    output_file = r"../../../plugins/blender/tools_dict_temp.py"

    # Parse tools and generate Python file
    tools = parse_tools(input_file)
    generate_python_file(tools, output_file)

    print(f"Python file generated at {output_file}")
