#pragma once

#include <d3d11.h>
#include <DirectXMath.h>

// For the DirectX Math library
using namespace DirectX;

class Transform 
{
	// Fields for two matricies, position and scale vectors, rotation vector/quaternion
	private:
		XMFLOAT4X4 world;
		XMFLOAT4X4 worldInverseTranspose;

		XMFLOAT3 position;
		XMFLOAT3 scale;
		XMFLOAT3 rotation;


		XMFLOAT3 forward;
		XMFLOAT3 up;
		XMFLOAT3 right;


	public:
		/*
			Constructor - Initialize all transformation values and world matricies
			Scale defaults to unit vector
		*/
		Transform();

		// deconstructor
		~Transform();

		// Setter methods - overwrite raw transform values
		void SetPosition(float x, float y, float z);
		void SetRotation(float pitch, float yaw, float roll);
		void SetScale(float x, float y, float z);

		// Getter methods - retrieve values and return
		XMFLOAT3 GetPosition();
		XMFLOAT3 GetPitchYawRoll();
		XMFLOAT3 GetScale();
		XMFLOAT4X4 GetWorldMatrix(); // May create the world matrix when necessay
		XMFLOAT4X4 GetWorldInverseTransposeMatrix();

		// Transformers - adjust existing transformation values by specified amounts
		void MoveAbsolute(float x, float y, float z);
		void Rotate(float pitch, float yaw, float roll);
		void Scale(float x, float y, float z);

		// Adjust position relative to transform's rotation
		void MoveRelative(float x, float y, float z);

		// Retrieve direction
		XMFLOAT3 GetRight();
		XMFLOAT3 GetUp();
		XMFLOAT3 GetForward();


		/* 
			Helper function to create matricies for the getters
			Create matrix for translation, scale, and rotation, 
			then multiply to world and inverse for transpose
		*/
		void UpdateMatricies(); 


};