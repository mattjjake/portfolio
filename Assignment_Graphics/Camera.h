#pragma once

#include <d3d11.h>
#include <DirectXMath.h>
#include <memory>

#include "Transform.h"

// For the DirectX Math library
using namespace DirectX;

class Camera
{
private:
	// Fields for own transform, view and projection matrix
	std::shared_ptr<Transform> cam;
	XMFLOAT4X4 view;
	XMFLOAT4X4 projection;

	// Customization
	float moveSpeed;
	float mouseSpeed;

public:
	/*
		Constructor - Take aspect ratio and initial position
	*/
	Camera(float aspectRatio, XMFLOAT3 initialPosition);

	// deconstructor
	~Camera();

	// Getters
	XMFLOAT4X4 GetViewMatrix();
	XMFLOAT4X4 GetProjectionMatrix();
	std::shared_ptr<Transform> GetTransform();

	// Update methods
	void UpdateProjectionMatrix(float aspectRatio);
	void UpdateViewMatrix();

	void Update(float dt);
};
