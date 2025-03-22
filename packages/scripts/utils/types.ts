/**
 * Get appropriate type name for target language
 */
export function getTypeForLanguage(
  schemaProp: any,
  lang: string
): string {
  if (!schemaProp)
    return lang === "python"
      ? "Any"
      : "TSharedPtr<FJsonValue>";

  const type = schemaProp.type;
  const isEnum = schemaProp.enum !== undefined;

  if (lang === "python") {
    if (isEnum) {
      return "str"; // Python enums are still strings when passed via JSON
    }

    switch (type) {
      case "string":
        return "str";
      case "number":
      case "integer":
        return type === "integer" ? "int" : "float";
      case "boolean":
        return "bool";
      case "array":
        // Try to detect array element type
        if (schemaProp.items) {
          const itemType = getTypeForLanguage(
            schemaProp.items,
            lang
          );
          return `List[${itemType}]`;
        }
        return "List[Any]";
      case "object":
        return "Dict[str, Any]";
      default:
        return "Any";
    }
  } else if (lang === "cpp") {
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

  return "any";
}
