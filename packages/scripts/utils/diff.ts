function parseExistingPythonFunctions(
  fileContent: string
): Set<string> {
  const functionNames = new Set<string>();
  // Basic pattern: "def <name>(params: Dict[str, Any]) -> Dict[str, Any]:"
  const functionRegex = /\bdef\s+(\w+)\s*\(/g;
  let match;
  while (
    (match = functionRegex.exec(fileContent)) !== null
  ) {
    match[1] && functionNames.add(match[1]);
  }
  return functionNames;
}

function parseExistingUnrealFunctions(
  fileContent: string
): Set<string> {
  const functionNames = new Set<string>();
  // We'll look for lines like: "TSharedPtr<FJsonObject> SomeFunc(const TSharedPtr<FJsonObject>& Params)" or UFUNCTION lines
  const functionRegex =
    /TSharedPtr<FJsonObject>\s+(\w+)\s*\(/g;
  let match;
  while (
    (match = functionRegex.exec(fileContent)) !== null
  ) {
    match[1] && functionNames.add(match[1]);
  }
  return functionNames;
}

export {
  parseExistingPythonFunctions,
  parseExistingUnrealFunctions,
};
