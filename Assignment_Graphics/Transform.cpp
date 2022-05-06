#include "Transform.h"


// Constructor
Transform::Transform()
{
	// Initialize values
	scale = XMFLOAT3(1, 1, 1);
	rotation = XMFLOAT3(0, 0, 0);
	position = XMFLOAT3(0, 0, 0);

	// Initializes matricies 
	XMStoreFloat4x4(&world, XMMatrixIdentity());
	XMStoreFloat4x4(&worldInverseTranspose, XMMatrixIdentity());
}

// deconstructor
Transform::~Transform()
{
	// empty
}

// Setters
void Transform::SetPosition(float x, float y, float z)
{
	position = XMFLOAT3(x, y, z);
}

void Transform::SetRotation(float pitch, float yaw, float roll)
{
	rotation = XMFLOAT3(pitch, yaw, roll);
}

void Transform::SetScale(float x, float y, float z)
{
	scale = XMFLOAT3(x, y, z);
}

XMFLOAT3 Transform::GetPosition()
{
	return position;
}

XMFLOAT3 Transform::GetPitchYawRoll()
{
	return rotation;
}

XMFLOAT3 Transform::GetScale()
{
	return scale;
}

XMFLOAT4X4 Transform::GetWorldMatrix()
{
	// update matricies when returning one
	UpdateMatricies();
	return world;
}

XMFLOAT4X4 Transform::GetWorldInverseTransposeMatrix()
{
	// update matricies when returning one
	UpdateMatricies();
	return worldInverseTranspose;
}

// Adjust position values as specified
void Transform::MoveAbsolute(float x, float y, float z)
{
	position = XMFLOAT3(position.x + x, position.y + y, position.z + z);
}

// Create relative move of position
void Transform::MoveRelative(float x, float y, float z)
{
	// Direction
	XMVECTOR moveV = XMVectorSet(x, y, z, 0.0f);

	// Rotation
	XMVECTOR moveQ = XMQuaternionRotationRollPitchYaw(rotation.x, rotation.y, rotation.z);

	// Rotate that direction
	XMVECTOR rotate = XMVector3Rotate(moveV, moveQ);

	// Load current position, then add and store it
	XMVECTOR finish = rotate + XMLoadFloat3(&position);
	XMStoreFloat3(&position, finish);
}

XMFLOAT3 Transform::GetRight()
{
	XMVECTOR moveV = XMVectorSet(1.0f, 0.0f, 0.0f, 0.0f);

	// Rotation
	XMVECTOR moveQ = XMQuaternionRotationRollPitchYaw(rotation.x, rotation.y, rotation.z);

	// Rotate that direction
	XMVECTOR rotate = XMVector3Rotate(moveV, moveQ);

	// store it
	XMStoreFloat3(&right, rotate);
	return right;
}

XMFLOAT3 Transform::GetUp()
{
	XMVECTOR moveV = XMVectorSet(0.0f, 1.0f, 0.0f, 0.0f);

	// Rotation
	XMVECTOR moveQ = XMQuaternionRotationRollPitchYaw(rotation.x, rotation.y, rotation.z);

	// Rotate that direction
	XMVECTOR rotate = XMVector3Rotate(moveV, moveQ);

	// store it
	XMStoreFloat3(&up, rotate);
	return up;
}

XMFLOAT3 Transform::GetForward()
{
	// Direction
	XMVECTOR moveV = XMVectorSet(0.0f, 0.0f, 1.0f, 0.0f);

	// Rotation
	XMVECTOR moveQ = XMQuaternionRotationRollPitchYaw(rotation.x, rotation.y, rotation.z);

	// Rotate that direction
	XMVECTOR rotate = XMVector3Rotate(moveV, moveQ);

	// store it
	XMStoreFloat3(&forward, rotate);

	return forward;
}

// Adjust rotation values as specified
void Transform::Rotate(float pitch, float yaw, float roll)
{
	rotation = XMFLOAT3(rotation.x + pitch, rotation.y + yaw, rotation.z + roll);
}

// Adjust scale values as specified
void Transform::Scale(float x, float y, float z)
{
	scale = XMFLOAT3(scale.x * x, scale.y * y, scale.z * z);
}

// Update matricies by transformation
void Transform::UpdateMatricies()
{
	// Create transformation matricies
	XMMATRIX positionMatrix = XMMatrixTranslation(position.x, position.y, position.z);
	XMMATRIX scaleMatrix = XMMatrixScaling(scale.x, scale.y, scale.z);
	XMMATRIX rotationMatrix = XMMatrixRotationRollPitchYaw(rotation.x, rotation.y, rotation.z);

	// Apply to world matrix
	XMMATRIX worldMatrix = scaleMatrix * rotationMatrix * positionMatrix;

	// Store as an XMFLOAT4X4 for both world and worldInverseTranspose
	XMStoreFloat4x4(&world, worldMatrix);
	XMStoreFloat4x4(&worldInverseTranspose, XMMatrixInverse(0, XMMatrixTranspose(worldMatrix)));
}
