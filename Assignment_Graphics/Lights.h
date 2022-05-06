#pragma once
#define LIGHT_TYPE_DIRECTIONAL 0
#define LIGHT_TYPE_POINT 1
#define LIGHT_TYPE_SPOT 2
#include <DirectXMath.h>
using namespace DirectX;

struct Light
{
	// Make sure all data is in order
	int Type; // Light type
	XMFLOAT3 Direction; // Direction for spot/directional lights
	float Range; // Point/Spot light max range for attenuation
	XMFLOAT3 Position; // Point/Spot light position
	float Intensity; 
	XMFLOAT3 Color;
	float SpotFallOff; // Spot lights need "cone" size value
	XMFLOAT3 Padding; // Makes it fit into 16 bytes
};
