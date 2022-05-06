#include "Entity.h"
#include <memory>
#include "Camera.h"

// For the DirectX Math library
using namespace DirectX;


Entity::Entity(std::shared_ptr<Mesh> ptr, std::shared_ptr<Material> material)
{
	pointMesh = ptr;
	obj = std::make_shared<Transform>();
	this->material = material;
}

Entity::~Entity()
{
	// Empty
}

std::shared_ptr<Mesh> Entity::GetMesh()
{
	return pointMesh;
}

std::shared_ptr<Material> Entity::GetMaterial()
{
	return material;
}

std::shared_ptr<Transform> Entity::GetTransform()
{
	return obj;
}

void Entity::SetMaterial(std::shared_ptr<Material> material)
{
	this->material = material;
}

void Entity::Draw(Microsoft::WRL::ComPtr<ID3D11DeviceContext> context, std::shared_ptr<Camera> camera)
{
	material->GetVertexShader()->SetShader();
	material->GetPixelShader()->SetShader();

	std::shared_ptr<SimpleVertexShader> vs = material->GetVertexShader();
	vs->SetMatrix4x4("world", obj->GetWorldMatrix()); // match variable
	vs->SetMatrix4x4("worldInvTranspose", GetTransform()->GetWorldInverseTransposeMatrix());
	vs->SetMatrix4x4("view", camera->GetViewMatrix()); // names in the
	vs->SetMatrix4x4("projection", camera->GetProjectionMatrix()); // shader’s cbuffer!

	std::shared_ptr<SimplePixelShader> ps = material->GetPixelShader();
	ps->SetFloat4("colorTint", material->GetColorTint()); // Strings here MUST
	material->PrepareMaterial();

	vs->CopyAllBufferData();
	ps->CopyAllBufferData();

	// Use Mesh class' draw
	pointMesh->Draw();
}
