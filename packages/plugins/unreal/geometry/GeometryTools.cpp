// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "GeometryTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPGeometryTools::UMCPGeometryTools()
{
    RegisterTools();
}

void UMCPGeometryTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("createGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::createGeometry));
}

TSharedPtr<FJsonObject> UMCPGeometryTools::createGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for createGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "GeometryTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPGeometryTools::UMCPGeometryTools()
{
    RegisterTools();
}

void UMCPGeometryTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("addNode", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNode));
    FMCPProtocolHandler::Get().RegisterTool("connectNodes", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::connectNodes));
    FMCPProtocolHandler::Get().RegisterTool("endEditGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::endEditGeometry));
    FMCPProtocolHandler::Get().RegisterTool("getNodeDefinition", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::getNodeDefinition));
    FMCPProtocolHandler::Get().RegisterTool("getNodeTypes", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::getNodeTypes));
    FMCPProtocolHandler::Get().RegisterTool("startEditGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::startEditGeometry));
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNode(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNode in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // No parameters to extract
        
        // TODO: Implement actual Unreal Engine API calls for addNode
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNode: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::connectNodes(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing connectNodes in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter from
        if (!Params->HasField("from")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter from is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter from is missing");
            return Response;
        }
        // Extract from (FString)
        FString from;
        if (Params->TryGetStringField("from", from)) {
        }
        // Check required parameter fromPort
        if (!Params->HasField("fromPort")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter fromPort is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter fromPort is missing");
            return Response;
        }
        // Extract fromPort (FString)
        FString fromPort;
        if (Params->TryGetStringField("fromPort", fromPort)) {
        }
        // Check required parameter to
        if (!Params->HasField("to")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter to is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter to is missing");
            return Response;
        }
        // Extract to (FString)
        FString to;
        if (Params->TryGetStringField("to", to)) {
        }
        // Check required parameter toPort
        if (!Params->HasField("toPort")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter toPort is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter toPort is missing");
            return Response;
        }
        // Extract toPort (FString)
        FString toPort;
        if (Params->TryGetStringField("toPort", toPort)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for connectNodes
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in connectNodes: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::endEditGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing endEditGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for endEditGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in endEditGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::getNodeDefinition(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getNodeDefinition in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter nodeType
        if (!Params->HasField("nodeType")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter nodeType is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter nodeType is missing");
            return Response;
        }
        // Extract nodeType (FString)
        FString nodeType;
        if (Params->TryGetStringField("nodeType", nodeType)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getNodeDefinition
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex nodeDefinition value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getNodeDefinition: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::getNodeTypes(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getNodeTypes in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for getNodeTypes
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex nodeTypes value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getNodeTypes: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::startEditGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing startEditGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter id
        if (!Params->HasField("id")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter id is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter id is missing");
            return Response;
        }
        // Extract id (FString)
        FString id;
        if (Params->TryGetStringField("id", id)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for startEditGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in startEditGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "GeometryTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPGeometryTools::UMCPGeometryTools()
{
    RegisterTools();
}

void UMCPGeometryTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("setNodeProperty", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::setNodeProperty));
}

TSharedPtr<FJsonObject> UMCPGeometryTools::setNodeProperty(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setNodeProperty in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter nodeId
        if (!Params->HasField("nodeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter nodeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter nodeId is missing");
            return Response;
        }
        // Extract nodeId (FString)
        FString nodeId;
        if (Params->TryGetStringField("nodeId", nodeId)) {
        }
        // Check required parameter property
        if (!Params->HasField("property")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter property is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter property is missing");
            return Response;
        }
        // Extract property (FString)
        FString property;
        if (Params->TryGetStringField("property", property)) {
        }

        // Extract complex parameter value 
        const TSharedPtr<FJsonValue>* valueValue = nullptr;
        if (Params->TryGetField("value", valueValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setNodeProperty
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setNodeProperty: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "GeometryTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPGeometryTools::UMCPGeometryTools()
{
    RegisterTools();
}

void UMCPGeometryTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("addNodeCombineXYZ", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeCombineXYZ));
    FMCPProtocolHandler::Get().RegisterTool("addNodeMath", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeMath));
    FMCPProtocolHandler::Get().RegisterTool("addNodeMeshCone", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeMeshCone));
    FMCPProtocolHandler::Get().RegisterTool("addNodeMeshCube", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeMeshCube));
    FMCPProtocolHandler::Get().RegisterTool("addNodeMeshCylinder", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeMeshCylinder));
    FMCPProtocolHandler::Get().RegisterTool("addNodeMeshUVSphere", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeMeshUVSphere));
    FMCPProtocolHandler::Get().RegisterTool("addNodePositionInput", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodePositionInput));
    FMCPProtocolHandler::Get().RegisterTool("addNodeSeparateXYZ", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeSeparateXYZ));
    FMCPProtocolHandler::Get().RegisterTool("addNodeSetPosition", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeSetPosition));
    FMCPProtocolHandler::Get().RegisterTool("getNodeInputsOutputs", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::getNodeInputsOutputs));
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeCombineXYZ(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeCombineXYZ in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for addNodeCombineXYZ
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeCombineXYZ: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeMath(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeMath in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter operation
        if (!Params->HasField("operation")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter operation is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter operation is missing");
            return Response;
        }
        // Extract operation (FString)
        FString operation;
        if (Params->TryGetStringField("operation", operation)) {
            // Validate enum value for operation
            static const TArray<FString> ValidoperationValues = {TEXT("Arctan2"), TEXT("Multiply"), TEXT("Add"), TEXT("Sine")};
            if (!ValidoperationValues.Contains(operation)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid operation value: %s"), *operation);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid operation value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeMath
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeMath: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeMeshCone(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeMeshCone in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract Vertices (int32)
        int32 Vertices = 0;
        if (Params->TryGetNumberField("Vertices", Vertices)) {
        }

        // Extract Radius Top (double)
        double Radius Top = 0;
        if (Params->TryGetNumberField("Radius Top", Radius Top)) {
        }

        // Extract Radius Bottom (double)
        double Radius Bottom = 0;
        if (Params->TryGetNumberField("Radius Bottom", Radius Bottom)) {
        }

        // Extract Depth (double)
        double Depth = 0;
        if (Params->TryGetNumberField("Depth", Depth)) {
        }

        // Extract Side Segments (int32)
        int32 Side Segments = 0;
        if (Params->TryGetNumberField("Side Segments", Side Segments)) {
        }

        // Extract Fill Segments (int32)
        int32 Fill Segments = 0;
        if (Params->TryGetNumberField("Fill Segments", Fill Segments)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeMeshCone
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeMeshCone: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeMeshCube(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeMeshCube in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract complex parameter Size 
        const TSharedPtr<FJsonValue>* SizeValue = nullptr;
        if (Params->TryGetField("Size", SizeValue)) {
        }

        // Extract Vertices X (int32)
        int32 Vertices X = 0;
        if (Params->TryGetNumberField("Vertices X", Vertices X)) {
        }

        // Extract Vertices Y (int32)
        int32 Vertices Y = 0;
        if (Params->TryGetNumberField("Vertices Y", Vertices Y)) {
        }

        // Extract Vertices Z (int32)
        int32 Vertices Z = 0;
        if (Params->TryGetNumberField("Vertices Z", Vertices Z)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeMeshCube
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeMeshCube: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeMeshCylinder(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeMeshCylinder in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract Vertices (int32)
        int32 Vertices = 0;
        if (Params->TryGetNumberField("Vertices", Vertices)) {
        }

        // Extract Radius (double)
        double Radius = 0;
        if (Params->TryGetNumberField("Radius", Radius)) {
        }

        // Extract Depth (double)
        double Depth = 0;
        if (Params->TryGetNumberField("Depth", Depth)) {
        }

        // Extract Side Segments (int32)
        int32 Side Segments = 0;
        if (Params->TryGetNumberField("Side Segments", Side Segments)) {
        }

        // Extract Fill Segments (int32)
        int32 Fill Segments = 0;
        if (Params->TryGetNumberField("Fill Segments", Fill Segments)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeMeshCylinder
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeMeshCylinder: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeMeshUVSphere(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeMeshUVSphere in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract Radius (double)
        double Radius = 0;
        if (Params->TryGetNumberField("Radius", Radius)) {
        }

        // Extract Rings (int32)
        int32 Rings = 0;
        if (Params->TryGetNumberField("Rings", Rings)) {
        }

        // Extract Segments (int32)
        int32 Segments = 0;
        if (Params->TryGetNumberField("Segments", Segments)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeMeshUVSphere
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeMeshUVSphere: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodePositionInput(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodePositionInput in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for addNodePositionInput
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodePositionInput: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeSeparateXYZ(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeSeparateXYZ in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for addNodeSeparateXYZ
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeSeparateXYZ: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeSetPosition(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeSetPosition in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for addNodeSetPosition
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("nodeId", TEXT("TODO")); // TODO: Set actual nodeId value
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeSetPosition: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::getNodeInputsOutputs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getNodeInputsOutputs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter nodeId
        if (!Params->HasField("nodeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter nodeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter nodeId is missing");
            return Response;
        }
        // Extract nodeId (FString)
        FString nodeId;
        if (Params->TryGetStringField("nodeId", nodeId)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getNodeInputsOutputs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex inputs value
        // TODO: Set complex outputs value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getNodeInputsOutputs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "GeometryTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPGeometryTools::UMCPGeometryTools()
{
    RegisterTools();
}

void UMCPGeometryTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("addNodeBatch", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::addNodeBatch));
    FMCPProtocolHandler::Get().RegisterTool("setNodePropertyByIndex", FMCPToolDelegate::CreateUObject(this, &UMCPGeometryTools::setNodePropertyByIndex));
}

TSharedPtr<FJsonObject> UMCPGeometryTools::addNodeBatch(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addNodeBatch in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter nodes
        if (!Params->HasField("nodes")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter nodes is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter nodes is missing");
            return Response;
        }
        // Extract complex parameter nodes 
        const TSharedPtr<FJsonValue>* nodesValue = nullptr;
        if (Params->TryGetField("nodes", nodesValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addNodeBatch
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex nodeIds value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addNodeBatch: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPGeometryTools::setNodePropertyByIndex(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setNodePropertyByIndex in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter nodeId
        if (!Params->HasField("nodeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter nodeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter nodeId is missing");
            return Response;
        }
        // Extract nodeId (FString)
        FString nodeId;
        if (Params->TryGetStringField("nodeId", nodeId)) {
        }
        // Check required parameter propertyIndex
        if (!Params->HasField("propertyIndex")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter propertyIndex is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter propertyIndex is missing");
            return Response;
        }
        // Extract propertyIndex (double)
        double propertyIndex = 0;
        if (Params->TryGetNumberField("propertyIndex", propertyIndex)) {
        }
        // Check required parameter value
        if (!Params->HasField("value")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter value is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter value is missing");
            return Response;
        }
        // Extract value (FString)
        FString value;
        if (Params->TryGetStringField("value", value)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setNodePropertyByIndex
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setNodePropertyByIndex: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}
