#include "PBR.hlsli"
#ifndef __GGP_SHADER_INCLUDES__ // Each .hlsli file needs a unique identifier!
#define __GGP_SHADER_INCLUDES__

// ALL of your code pieces (structs, functions, etc.) go here!
float Random(float2 s)
{
	return frac(sin(dot(s, float2(12.9898, 78.233))) * 43758.5453123);
}

#define LIGHT_TYPE_DIRECTIONAL 0
#define LIGHT_TYPE_POINT 1
#define LIGHT_TYPE_SPOT 2
struct Light
{
	// Make sure all data is in order
	int Type; // Light type
	float3 Direction; // Direction for spot/directional lights
	float Range; // Point/Spot light max range for attenuation
	float3 Position; // Point/Spot light position
	float Intensity;
	float3 Color;
	float SpotFallOff; // Spot lights need "cone" size value
	float3 Padding; // Makes it fit into 16 bytes
};


// Pass in light, normal, surface color, and ambient light
float4 DirLight(Light dirLight, float3 normal, float3 V, float roughness, float3 specColor, float metalness,
	float3 surfaceColor)
{
	// Negate, then normalize
	float3 dirCast = normalize(dirLight.Direction * -1);

	// Diffuse
	float diff = DiffusePBR(normal, dirCast);

	// Cook-Torrence Calc
	float3 spec = MicrofacetBRDF(normal, dirCast, V, roughness, specColor);

	// Calculate diffuse with energy conservation
	// (Reflected light doesn't get diffused)
	float3 balancedDiff = DiffuseEnergyConserve(diff, spec, metalness);
	// Combine the final diffuse and specular values for this light
	float3 total = (balancedDiff * surfaceColor + spec) * dirLight.Intensity * dirLight.Color;

	// Return with alpha of 1
	return float4(total, 1);
}

float Attenuate(Light light, float3 worldPos)
{
	float dist = distance(light.Position, worldPos);
	float att = saturate(1.0f - (dist * dist / (light.Range * light.Range)));
	return att * att;
}

// Pass in light, V, roughness, normal, and world position
float4 PointLight(Light pointLight, float3 V, float roughness, float3 normal, float3 worldPos, float3 specColor, float metalness,
	float surfaceColor)
{
	// Get the direction and diffuse values
	float3 direction = normalize(pointLight.Position - worldPos);
	float diff = DiffusePBR(normal, direction);

	// Cook-Torrence Calc
	float3 spec = MicrofacetBRDF(normal, direction, V, roughness, specColor);

	// Calc attenuation for point light
	spec *= Attenuate(pointLight, worldPos);

	// Calculate diffuse with energy conservation, combine
	float3 balancedDiff = DiffuseEnergyConserve(diff, spec, metalness);
	float3 total = (balancedDiff * surfaceColor + spec) * pointLight.Intensity * pointLight.Color;

	return float4(total, 1);
}

// Struct representing a single vertex worth of data
// - This should match the vertex definition in our C++ code
// - By "match", I mean the size, order and number of members
// - The name of the struct itself is unimportant, but should be descriptive
// - Each variable must have a semantic, which defines its usage
struct VertexShaderInput
{
	// Data type
	//  |
	//  |   Name          Semantic
	//  |    |                |
	//  v    v                v
	float3 localPosition	: POSITION;     // XYZ position
	float3 normal			: NORMAL;
	float2 uv				: TEXCOORD;
	float3 tangent			: TANGENT;
};

// Struct representing the data we expect to receive from earlier pipeline stages
// - Should match the output of our corresponding vertex shader
// - The name of the struct itself is unimportant
// - The variable names don't have to match other shaders (just the semantics)
// - Each variable must have a semantic, which defines its usage
struct VertexToPixel
{
	// Data type
	//  |
	//  |   Name          Semantic
	//  |    |                |
	//  v    v                v
	float4 screenPosition	: SV_POSITION;
	float2 uv				: TEXCOORD;
	float3 normal			: NORMAL;
	float3 worldPosition	: POSITION;
	float3 tangent			: TANGENT;
};

// Vertex to Pixel pipeline for the Skybox
struct VertexToPixel_Sky
{
	float4 position		: SV_POSITION;
	float3 sampleDir	: DIRECTION;
};

#endif