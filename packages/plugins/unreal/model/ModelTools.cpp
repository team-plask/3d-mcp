// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("createEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createEdges));
    FMCPProtocolHandler::Get().RegisterTool("getGroups", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getGroups));
    FMCPProtocolHandler::Get().RegisterTool("bridge", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::bridge));
    FMCPProtocolHandler::Get().RegisterTool("setEdgeCreases", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setEdgeCreases));
    FMCPProtocolHandler::Get().RegisterTool("getMeshs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getMeshs));
    FMCPProtocolHandler::Get().RegisterTool("deleteMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteMaterials));
    FMCPProtocolHandler::Get().RegisterTool("getSubdivisionModifiers", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getSubdivisionModifiers));
    FMCPProtocolHandler::Get().RegisterTool("createCurves", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createCurves));
    FMCPProtocolHandler::Get().RegisterTool("getFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getFaces));
    FMCPProtocolHandler::Get().RegisterTool("deleteCurves", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteCurves));
    FMCPProtocolHandler::Get().RegisterTool("updateCurves", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateCurves));
    FMCPProtocolHandler::Get().RegisterTool("listCurves", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listCurves));
    FMCPProtocolHandler::Get().RegisterTool("createFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createFaces));
    FMCPProtocolHandler::Get().RegisterTool("extrudeFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::extrudeFaces));
    FMCPProtocolHandler::Get().RegisterTool("createMeshs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createMeshs));
    FMCPProtocolHandler::Get().RegisterTool("getEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getEdges));
    FMCPProtocolHandler::Get().RegisterTool("listMeshs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listMeshs));
    FMCPProtocolHandler::Get().RegisterTool("updateMeshs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateMeshs));
    FMCPProtocolHandler::Get().RegisterTool("transformUVs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::transformUVs));
    FMCPProtocolHandler::Get().RegisterTool("listUVMaps", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listUVMaps));
    FMCPProtocolHandler::Get().RegisterTool("splitMeshes", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::splitMeshes));
    FMCPProtocolHandler::Get().RegisterTool("listFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listFaces));
    FMCPProtocolHandler::Get().RegisterTool("getVertexs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getVertexs));
    FMCPProtocolHandler::Get().RegisterTool("assignMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::assignMaterials));
    FMCPProtocolHandler::Get().RegisterTool("updateFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateFaces));
    FMCPProtocolHandler::Get().RegisterTool("updateUVMaps", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateUVMaps));
    FMCPProtocolHandler::Get().RegisterTool("listMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listMaterials));
    FMCPProtocolHandler::Get().RegisterTool("deleteUVMaps", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteUVMaps));
    FMCPProtocolHandler::Get().RegisterTool("createMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createMaterials));
    FMCPProtocolHandler::Get().RegisterTool("createUVMaps", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createUVMaps));
    FMCPProtocolHandler::Get().RegisterTool("transformVertices", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::transformVertices));
    FMCPProtocolHandler::Get().RegisterTool("updateEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateEdges));
    FMCPProtocolHandler::Get().RegisterTool("unwrapUVs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::unwrapUVs));
    FMCPProtocolHandler::Get().RegisterTool("listEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listEdges));
    FMCPProtocolHandler::Get().RegisterTool("listGroups", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listGroups));
    FMCPProtocolHandler::Get().RegisterTool("listVertexs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listVertexs));
    FMCPProtocolHandler::Get().RegisterTool("deleteVertexs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteVertexs));
    FMCPProtocolHandler::Get().RegisterTool("updateMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateMaterials));
    FMCPProtocolHandler::Get().RegisterTool("updateGroups", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateGroups));
    FMCPProtocolHandler::Get().RegisterTool("createSubdivisionModifiers", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createSubdivisionModifiers));
    FMCPProtocolHandler::Get().RegisterTool("createVertexs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createVertexs));
    FMCPProtocolHandler::Get().RegisterTool("getCurves", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getCurves));
    FMCPProtocolHandler::Get().RegisterTool("deleteSubdivisionModifiers", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteSubdivisionModifiers));
    FMCPProtocolHandler::Get().RegisterTool("getMaterials", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getMaterials));
    FMCPProtocolHandler::Get().RegisterTool("deleteGroups", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteGroups));
    FMCPProtocolHandler::Get().RegisterTool("createGroups", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createGroups));
    FMCPProtocolHandler::Get().RegisterTool("updateSubdivisionModifiers", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateSubdivisionModifiers));
    FMCPProtocolHandler::Get().RegisterTool("deleteFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteFaces));
    FMCPProtocolHandler::Get().RegisterTool("getUVMaps", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getUVMaps));
    FMCPProtocolHandler::Get().RegisterTool("deleteMeshs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteMeshs));
    FMCPProtocolHandler::Get().RegisterTool("bevel", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::bevel));
    FMCPProtocolHandler::Get().RegisterTool("listSubdivisionModifiers", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::listSubdivisionModifiers));
    FMCPProtocolHandler::Get().RegisterTool("deleteEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteEdges));
    FMCPProtocolHandler::Get().RegisterTool("updateVertexs", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::updateVertexs));
    FMCPProtocolHandler::Get().RegisterTool("combineMeshes", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::combineMeshes));
}

TSharedPtr<FJsonObject> UMCPModelTools::createEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getGroups(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getGroups in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getGroups
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getGroups: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::bridge(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing bridge in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for bridge
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex results value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in bridge: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::setEdgeCreases(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setEdgeCreases in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setEdgeCreases
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setEdgeCreases: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getMeshs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getMeshs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getMeshs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getMeshs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getSubdivisionModifiers in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getSubdivisionModifiers
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getSubdivisionModifiers: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createCurves(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createCurves in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createCurves
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createCurves: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteCurves(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteCurves in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteCurves
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteCurves: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateCurves(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateCurves in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateCurves
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateCurves: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listCurves(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listCurves in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listCurves
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listCurves: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::extrudeFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing extrudeFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for extrudeFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex results value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in extrudeFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createMeshs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createMeshs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createMeshs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createMeshs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listMeshs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listMeshs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listMeshs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listMeshs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateMeshs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateMeshs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateMeshs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateMeshs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::transformUVs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing transformUVs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for transformUVs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in transformUVs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listUVMaps(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listUVMaps in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listUVMaps
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listUVMaps: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::splitMeshes(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing splitMeshes in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for splitMeshes
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex results value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in splitMeshes: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getVertexs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getVertexs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getVertexs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getVertexs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::assignMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing assignMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for assignMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in assignMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateUVMaps(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateUVMaps in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateUVMaps
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateUVMaps: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteUVMaps(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteUVMaps in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteUVMaps
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteUVMaps: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createUVMaps(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createUVMaps in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createUVMaps
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createUVMaps: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::transformVertices(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing transformVertices in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for transformVertices
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in transformVertices: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::unwrapUVs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing unwrapUVs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for unwrapUVs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex results value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in unwrapUVs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listGroups(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listGroups in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listGroups
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listGroups: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listVertexs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listVertexs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listVertexs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listVertexs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteVertexs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteVertexs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteVertexs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteVertexs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateGroups(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateGroups in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateGroups
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateGroups: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createSubdivisionModifiers in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createSubdivisionModifiers
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createSubdivisionModifiers: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createVertexs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createVertexs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createVertexs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createVertexs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getCurves(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getCurves in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getCurves
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getCurves: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteSubdivisionModifiers in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteSubdivisionModifiers
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteSubdivisionModifiers: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getMaterials(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getMaterials in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getMaterials
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getMaterials: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteGroups(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteGroups in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteGroups
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteGroups: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createGroups(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createGroups in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createGroups
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex ids value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createGroups: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateSubdivisionModifiers in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateSubdivisionModifiers
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateSubdivisionModifiers: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getUVMaps(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getUVMaps in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for getUVMaps
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getUVMaps: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteMeshs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteMeshs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteMeshs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteMeshs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::bevel(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing bevel in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for bevel
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex results value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in bevel: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::listSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing listSubdivisionModifiers in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract parentId (FString)
        FString parentId;
        if (Params->TryGetStringField("parentId", parentId)) {
        }

        // Extract complex parameter filters 
        const TSharedPtr<FJsonValue>* filtersValue = nullptr;
        if (Params->TryGetField("filters", filtersValue)) {
        }

        // Extract limit (int32)
        int32 limit = 0;
        if (Params->TryGetNumberField("limit", limit)) {
        }

        // Extract offset (int32)
        int32 offset = 0;
        if (Params->TryGetNumberField("offset", offset)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for listSubdivisionModifiers
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex items value
        Response->SetNumberField("totalCount", 0); // TODO: Set actual totalCount value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in listSubdivisionModifiers: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::updateVertexs(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing updateVertexs in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for updateVertexs
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in updateVertexs: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::combineMeshes(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing combineMeshes in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter meshIds
        if (!Params->HasField("meshIds")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter meshIds is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter meshIds is missing");
            return Response;
        }
        // Extract complex parameter meshIds 
        const TSharedPtr<FJsonValue>* meshIdsValue = nullptr;
        if (Params->TryGetField("meshIds", meshIdsValue)) {
        }

        // Extract name (FString)
        FString name;
        if (Params->TryGetStringField("name", name)) {
        }

        // Extract preserveSubMeshes (bool)  
        bool preserveSubMeshes = false;
        if (Params->TryGetBoolField("preserveSubMeshes", preserveSubMeshes)) {
        }

        // Extract worldSpace (bool)  
        bool worldSpace = false;
        if (Params->TryGetBoolField("worldSpace", worldSpace)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for combineMeshes
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        Response->SetStringField("combinedMeshId", TEXT("TODO")); // TODO: Set actual combinedMeshId value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in combineMeshes: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("delete", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::delete));
    FMCPProtocolHandler::Get().RegisterTool("deleteOnlyEdges", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteOnlyEdges));
    FMCPProtocolHandler::Get().RegisterTool("deleteOnlyFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteOnlyFaces));
    FMCPProtocolHandler::Get().RegisterTool("dissolve", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::dissolve));
    FMCPProtocolHandler::Get().RegisterTool("editStart", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::editStart));
    FMCPProtocolHandler::Get().RegisterTool("editStop", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::editStop));
    FMCPProtocolHandler::Get().RegisterTool("extrude", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::extrude));
    FMCPProtocolHandler::Get().RegisterTool("getSelect", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getSelect));
    FMCPProtocolHandler::Get().RegisterTool("inset", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::inset));
    FMCPProtocolHandler::Get().RegisterTool("setMode", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setMode));
    FMCPProtocolHandler::Get().RegisterTool("setSelect", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setSelect));
    FMCPProtocolHandler::Get().RegisterTool("subdivide", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::subdivide));
}

TSharedPtr<FJsonObject> UMCPModelTools::delete(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing delete in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for delete
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in delete: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteOnlyEdges(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteOnlyEdges in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for deleteOnlyEdges
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteOnlyEdges: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteOnlyFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteOnlyFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for deleteOnlyFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteOnlyFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::dissolve(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing dissolve in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for dissolve
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in dissolve: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::editStart(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing editStart in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter meshIds
        if (!Params->HasField("meshIds")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter meshIds is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter meshIds is missing");
            return Response;
        }
        // Extract complex parameter meshIds 
        const TSharedPtr<FJsonValue>* meshIdsValue = nullptr;
        if (Params->TryGetField("meshIds", meshIdsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for editStart
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in editStart: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::editStop(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing editStop in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for editStop
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in editStop: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::extrude(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing extrude in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter offset
        if (!Params->HasField("offset")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter offset is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter offset is missing");
            return Response;
        }
        // Extract complex parameter offset 
        const TSharedPtr<FJsonValue>* offsetValue = nullptr;
        if (Params->TryGetField("offset", offsetValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for extrude
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in extrude: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getSelect(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getSelect in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for getSelect
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex selectedIds value
        Response->SetStringField("type", TEXT("TODO")); // TODO: Set actual type value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getSelect: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::inset(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing inset in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter items
        if (!Params->HasField("items")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter items is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter items is missing");
            return Response;
        }
        // Extract complex parameter items 
        const TSharedPtr<FJsonValue>* itemsValue = nullptr;
        if (Params->TryGetField("items", itemsValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for inset
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in inset: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::setMode(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setMode in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter mode
        if (!Params->HasField("mode")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter mode is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter mode is missing");
            return Response;
        }
        // Extract mode (FString)
        FString mode;
        if (Params->TryGetStringField("mode", mode)) {
            // Validate enum value for mode
            static const TArray<FString> ValidmodeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidmodeValues.Contains(mode)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid mode value: %s"), *mode);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid mode value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for setMode
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setMode: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::setSelect(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setSelect in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }

        // Extract mode (FString)
        FString mode;
        if (Params->TryGetStringField("mode", mode)) {
            // Validate enum value for mode
            static const TArray<FString> ValidmodeValues = {TEXT("replace"), TEXT("add"), TEXT("remove")};
            if (!ValidmodeValues.Contains(mode)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid mode value: %s"), *mode);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid mode value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for setSelect
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setSelect: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::subdivide(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing subdivide in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract count (int32)
        int32 count = 0;
        if (Params->TryGetNumberField("count", count)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for subdivide
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in subdivide: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("getGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getGeometry));
}

TSharedPtr<FJsonObject> UMCPModelTools::getGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for getGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex geometryData value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("deleteOnlyEdgesAndFaces", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteOnlyEdgesAndFaces));
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteOnlyEdgesAndFaces(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteOnlyEdgesAndFaces in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for deleteOnlyEdgesAndFaces
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteOnlyEdgesAndFaces: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("addPrimitives", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::addPrimitives));
    FMCPProtocolHandler::Get().RegisterTool("addSubsurfModifierLevel", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::addSubsurfModifierLevel));
    FMCPProtocolHandler::Get().RegisterTool("bridgeEdgeLoops", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::bridgeEdgeLoops));
    FMCPProtocolHandler::Get().RegisterTool("createEdge", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createEdge));
    FMCPProtocolHandler::Get().RegisterTool("createEdgeLoop", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createEdgeLoop));
    FMCPProtocolHandler::Get().RegisterTool("createFace", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createFace));
    FMCPProtocolHandler::Get().RegisterTool("edgeSlide", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::edgeSlide));
    FMCPProtocolHandler::Get().RegisterTool("selectEdgeLoop", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::selectEdgeLoop));
    FMCPProtocolHandler::Get().RegisterTool("selectEdgeRing", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::selectEdgeRing));
    FMCPProtocolHandler::Get().RegisterTool("transform", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::transform));
}

TSharedPtr<FJsonObject> UMCPModelTools::addPrimitives(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addPrimitives in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("sphere"), TEXT("cube"), TEXT("cylinder"), TEXT("plane")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for addPrimitives
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addPrimitives: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::addSubsurfModifierLevel(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing addSubsurfModifierLevel in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter meshId
        if (!Params->HasField("meshId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter meshId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter meshId is missing");
            return Response;
        }
        // Extract meshId (FString)
        FString meshId;
        if (Params->TryGetStringField("meshId", meshId)) {
        }
        // Check required parameter level
        if (!Params->HasField("level")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter level is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter level is missing");
            return Response;
        }
        // Extract level (int32)
        int32 level = 0;
        if (Params->TryGetNumberField("level", level)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for addSubsurfModifierLevel
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in addSubsurfModifierLevel: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::bridgeEdgeLoops(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing bridgeEdgeLoops in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for bridgeEdgeLoops
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in bridgeEdgeLoops: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createEdge(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createEdge in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for createEdge
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createEdge: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createEdgeLoop(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createEdgeLoop in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter edgeId
        if (!Params->HasField("edgeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter edgeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter edgeId is missing");
            return Response;
        }
        // Extract edgeId (FString)
        FString edgeId;
        if (Params->TryGetStringField("edgeId", edgeId)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createEdgeLoop
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createEdgeLoop: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::createFace(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createFace in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for createFace
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createFace: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::edgeSlide(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing edgeSlide in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter edgeId
        if (!Params->HasField("edgeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter edgeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter edgeId is missing");
            return Response;
        }
        // Extract edgeId (FString)
        FString edgeId;
        if (Params->TryGetStringField("edgeId", edgeId)) {
        }
        // Check required parameter factor
        if (!Params->HasField("factor")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter factor is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter factor is missing");
            return Response;
        }
        // Extract factor (double)
        double factor = 0;
        if (Params->TryGetNumberField("factor", factor)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for edgeSlide
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in edgeSlide: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::selectEdgeLoop(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing selectEdgeLoop in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter edgeId
        if (!Params->HasField("edgeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter edgeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter edgeId is missing");
            return Response;
        }
        // Extract edgeId (FString)
        FString edgeId;
        if (Params->TryGetStringField("edgeId", edgeId)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for selectEdgeLoop
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in selectEdgeLoop: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::selectEdgeRing(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing selectEdgeRing in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter edgeId
        if (!Params->HasField("edgeId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter edgeId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter edgeId is missing");
            return Response;
        }
        // Extract edgeId (FString)
        FString edgeId;
        if (Params->TryGetStringField("edgeId", edgeId)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for selectEdgeRing
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in selectEdgeRing: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::transform(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing transform in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        // Extract complex parameter translation 
        const TSharedPtr<FJsonValue>* translationValue = nullptr;
        if (Params->TryGetField("translation", translationValue)) {
        }

        // Extract complex parameter rotation 
        const TSharedPtr<FJsonValue>* rotationValue = nullptr;
        if (Params->TryGetField("rotation", rotationValue)) {
        }

        // Extract complex parameter scale 
        const TSharedPtr<FJsonValue>* scaleValue = nullptr;
        if (Params->TryGetField("scale", scaleValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for transform
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in transform: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("extrudeAlongNormals", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::extrudeAlongNormals));
}

TSharedPtr<FJsonObject> UMCPModelTools::extrudeAlongNormals(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing extrudeAlongNormals in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter distance
        if (!Params->HasField("distance")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter distance is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter distance is missing");
            return Response;
        }
        // Extract distance (double)
        double distance = 0;
        if (Params->TryGetNumberField("distance", distance)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for extrudeAlongNormals
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in extrudeAlongNormals: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("createFaceOrEdge", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createFaceOrEdge));
}

TSharedPtr<FJsonObject> UMCPModelTools::createFaceOrEdge(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createFaceOrEdge in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for createFaceOrEdge
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createFaceOrEdge: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("setMaterialParameters", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setMaterialParameters));
}

TSharedPtr<FJsonObject> UMCPModelTools::setMaterialParameters(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setMaterialParameters in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter materialId
        if (!Params->HasField("materialId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter materialId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter materialId is missing");
            return Response;
        }
        // Extract materialId (FString)
        FString materialId;
        if (Params->TryGetStringField("materialId", materialId)) {
        }
        // Check required parameter parameters
        if (!Params->HasField("parameters")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter parameters is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter parameters is missing");
            return Response;
        }
        // Extract complex parameter parameters 
        const TSharedPtr<FJsonValue>* parametersValue = nullptr;
        if (Params->TryGetField("parameters", parametersValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setMaterialParameters
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setMaterialParameters: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("createMeshFromPrimitive", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createMeshFromPrimitive));
    FMCPProtocolHandler::Get().RegisterTool("deleteGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteGeometry));
    FMCPProtocolHandler::Get().RegisterTool("deleteMesh", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteMesh));
    FMCPProtocolHandler::Get().RegisterTool("getSelectedGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getSelectedGeometry));
    FMCPProtocolHandler::Get().RegisterTool("setSelectedGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setSelectedGeometry));
}

TSharedPtr<FJsonObject> UMCPModelTools::createMeshFromPrimitive(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createMeshFromPrimitive in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("sphere"), TEXT("cube"), TEXT("cylinder"), TEXT("plane")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for createMeshFromPrimitive
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createMeshFromPrimitive: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteMesh(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteMesh in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter meshId
        if (!Params->HasField("meshId")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter meshId is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter meshId is missing");
            return Response;
        }
        // Extract meshId (FString)
        FString meshId;
        if (Params->TryGetStringField("meshId", meshId)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for deleteMesh
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteMesh: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::getSelectedGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getSelectedGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for getSelectedGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex selectedIds value
        Response->SetStringField("type", TEXT("TODO")); // TODO: Set actual type value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getSelectedGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::setSelectedGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setSelectedGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter ids
        if (!Params->HasField("ids")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ids is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ids is missing");
            return Response;
        }
        // Extract complex parameter ids 
        const TSharedPtr<FJsonValue>* idsValue = nullptr;
        if (Params->TryGetField("ids", idsValue)) {
        }
        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("vertex"), TEXT("edge"), TEXT("face")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }

        // Extract mode (FString)
        FString mode;
        if (Params->TryGetStringField("mode", mode)) {
            // Validate enum value for mode
            static const TArray<FString> ValidmodeValues = {TEXT("replace"), TEXT("add"), TEXT("remove")};
            if (!ValidmodeValues.Contains(mode)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid mode value: %s"), *mode);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid mode value");
                return Response;
            }
        }
        
        // TODO: Implement actual Unreal Engine API calls for setSelectedGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setSelectedGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("createLight", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::createLight));
    FMCPProtocolHandler::Get().RegisterTool("deleteObject", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::deleteObject));
}

TSharedPtr<FJsonObject> UMCPModelTools::createLight(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing createLight in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter type
        if (!Params->HasField("type")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter type is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter type is missing");
            return Response;
        }
        // Extract type (FString)
        FString type;
        if (Params->TryGetStringField("type", type)) {
            // Validate enum value for type
            static const TArray<FString> ValidtypeValues = {TEXT("point"), TEXT("directional"), TEXT("spot")};
            if (!ValidtypeValues.Contains(type)) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid type value: %s"), *type);
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid type value");
                return Response;
            }
        }

        // Extract complex parameter color 
        const TSharedPtr<FJsonValue>* colorValue = nullptr;
        if (Params->TryGetField("color", colorValue)) {
        }

        // Extract intensity (double)
        double intensity = 0;
        if (Params->TryGetNumberField("intensity", intensity)) {
        }
        // Check required parameter position
        if (!Params->HasField("position")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter position is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter position is missing");
            return Response;
        }
        // Extract complex parameter position 
        const TSharedPtr<FJsonValue>* positionValue = nullptr;
        if (Params->TryGetField("position", positionValue)) {
        }
        // Check required parameter direction
        if (!Params->HasField("direction")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter direction is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter direction is missing");
            return Response;
        }
        // Extract complex parameter direction 
        const TSharedPtr<FJsonValue>* directionValue = nullptr;
        if (Params->TryGetField("direction", directionValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for createLight
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in createLight: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

TSharedPtr<FJsonObject> UMCPModelTools::deleteObject(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing deleteObject in Unreal Engine"));
    
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
        
        // TODO: Implement actual Unreal Engine API calls for deleteObject
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in deleteObject: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("setGeometry", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setGeometry));
}

TSharedPtr<FJsonObject> UMCPModelTools::setGeometry(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setGeometry in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter geometryData
        if (!Params->HasField("geometryData")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter geometryData is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter geometryData is missing");
            return Response;
        }
        // Extract complex parameter geometryData 
        const TSharedPtr<FJsonValue>* geometryDataValue = nullptr;
        if (Params->TryGetField("geometryData", geometryDataValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setGeometry
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setGeometry: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("setGeometryde", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::setGeometryde));
}

TSharedPtr<FJsonObject> UMCPModelTools::setGeometryde(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing setGeometryde in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {        // Check required parameter geometryData
        if (!Params->HasField("geometryData")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter geometryData is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter geometryData is missing");
            return Response;
        }
        // Extract complex parameter geometryData 
        const TSharedPtr<FJsonValue>* geometryDataValue = nullptr;
        if (Params->TryGetField("geometryData", geometryDataValue)) {
        }
        
        // TODO: Implement actual Unreal Engine API calls for setGeometryde
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in setGeometryde: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "ModelTools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCPModelTools::UMCPModelTools()
{
    RegisterTools();
}

void UMCPModelTools::RegisterTools()
{
    FMCPProtocolHandler::Get().RegisterTool("getGeometryse", FMCPToolDelegate::CreateUObject(this, &UMCPModelTools::getGeometryse));
}

TSharedPtr<FJsonObject> UMCPModelTools::getGeometryse(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing getGeometryse in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {
        
        // TODO: Implement actual Unreal Engine API calls for getGeometryse
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        // TODO: Set complex geometryData value
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in getGeometryse: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}
