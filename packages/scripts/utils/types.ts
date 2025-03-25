/**
 * Convert JSON schema types to language-specific type annotations
 */
export function getTypeForLanguage(
  prop: any,
  language: string
): string {
  if (!prop) return language === "python" ? "Any" : "any";

  // Handle different languages
  switch (language) {
    case "python":
      return getPythonType(prop);
    case "cpp":
      return getCppType(prop);
    default:
      return "any";
  }
}

/**
 * Get Python type annotation from JSON schema - for function signatures
 * This generates simpler valid Python types for actual function definitions
 */
function getPythonType(
  prop: any,
  forDocstring: boolean = false
): string {
  // Handle references
  if (prop.$ref) {
    // Extract the type name from the reference
    const refType = prop.$ref.split("/").pop();
    return refType || "Any";
  }

  // Handle enums
  if (prop.enum) {
    return (
      "Literal[" +
      prop.enum
        .map((v: any) => JSON.stringify(v))
        .join(", ") +
      "]"
    );
  }

  // Handle arrays
  if (prop.type === "array" || prop.items) {
    const itemType = prop.items
      ? getPythonType(prop.items, forDocstring)
      : "Any";
    return `List[${itemType}]`;
  }

  // Handle objects with properties - different for docstring vs function signatures
  if (prop.type === "object" && prop.properties) {
    if (forDocstring) {
      // For docstrings, we can be more detailed as it's just documentation
      const propTypes = Object.entries(prop.properties).map(
        ([name, propSchema]: [string, any]) => {
          const propType = getPythonType(propSchema, true);
          return `"${name}": ${propType}`;
        }
      );

      if (propTypes.length > 0) {
        return `Dict[str, Any] with keys {${propTypes.join(
          ", "
        )}}`;
      }
    }
    // For function signatures, keep it simple and valid
    return "Dict[str, Any]";
  }

  // Handle objects with additionalProperties (dict-like)
  if (prop.type === "object" && prop.additionalProperties) {
    const valueType = getPythonType(
      prop.additionalProperties,
      forDocstring
    );
    return `Dict[str, ${valueType}]`;
  }

  // Handle oneOf, anyOf
  if (prop.oneOf || prop.anyOf) {
    const types = (prop.oneOf || prop.anyOf).map((p: any) =>
      getPythonType(p, forDocstring)
    );
    return `Union[${types.join(", ")}]`;
  }

  if (prop.allOf) {
    // For simplicity in allOf, just use Any
    return "Any";
  }

  // Handle primitive types
  switch (prop.type) {
    case "string":
      return "str";
    case "integer":
      return "int";
    case "number":
      return "float";
    case "boolean":
      return "bool";
    case "null":
      return "None";
    case "object":
      return "Dict[str, Any]";
    default:
      return "Any";
  }
}

// Expose a function specifically for docstring types
export function getDocstringType(prop: any): string {
  return getPythonType(prop, true);
}

/**
 * Get C++ type annotation from JSON schema
 */
function getCppType(prop: any): string {
  // Implementation for C++ types
  if (!prop) return "TSharedPtr<FJsonValue>";

  const type = prop.type;
  const isEnum = prop.enum !== undefined;

  if (isEnum) {
    return "FString"; // C++ enums are passed as strings via JSON
  }

  switch (type) {
    case "string":
      return "FString";
    case "number":
      return "double";
    case "integer":
      return "int32";
    case "boolean":
      return "bool";
    case "array":
      return "TArray<TSharedPtr<FJsonValue>>";
    case "object":
      return "TSharedPtr<FJsonObject>";
    default:
      return "TSharedPtr<FJsonValue>";
  }
}
