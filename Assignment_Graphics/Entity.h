#pragma once

#include "Transform.h"
#include "Mesh.h"
#include <memory>
#include "Camera.h"
#include "Material.h"

class Entity 
{
	// Utilize a transform obj and pointer to a mesh
	private:
		std::shared_ptr<Transform> obj;
		std::shared_ptr<Mesh> pointMesh;
		std::shared_ptr<Material> material;

	public:

		// Constructor accepts ptr and saves it
		Entity(std::shared_ptr<Mesh> ptr, std::shared_ptr<Material> material);

		// Empty deconstructor, do not delete pointer
		~Entity();

		// Getters
		std::shared_ptr<Mesh> GetMesh();
		std::shared_ptr<Material> GetMaterial();
		std::shared_ptr<Transform> GetTransform();

		void SetMaterial(std::shared_ptr<Material> material);

		// Draw Method
		void Draw(Microsoft::WRL::ComPtr<ID3D11DeviceContext> context, std::shared_ptr<Camera> camera);
};