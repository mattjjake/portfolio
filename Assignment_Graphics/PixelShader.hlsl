#include "Helper.hlsli"

Texture2D Albedo : register(t0); // Surface color
Texture2D NormalMap : register(t1);
Texture2D RoughnessMap : register(t2);
Texture2D MetalnessMap : register(t3);
SamplerState BasicSampler : register(s0); // "s" registers for samplers

cbuffer ExternalData : register(b0)
{
	// Make sure variables are in correct order
	// Simple Shader allows us to bypass byte rule
	float4 colorTint;
	float3 cameraPos;
	float3 ambient;

	// Lights
	Light dirLight1;
	Light dirLight2;
	Light dirLight3;
	Light pointLight1;
	Light pointLight2;
}


// --------------------------------------------------------
// The entry point (main method) for our pixel shader
// 
// - Input is the data coming down the pipeline (defined by the struct)
// - Output is a single color (float4)
// - Has a special semantic (SV_TARGET), which means 
//    "put the output of this into the current render target"
// - Named "main" because that's the default the shader compiler looks for
// --------------------------------------------------------
float4 main(VertexToPixel input) : SV_TARGET
{
	// Sample and unpack
	float3 unpackedNormal = NormalMap.Sample(BasicSampler, input.uv).rgb * 2 - 1;

	// Lambert equation- also needed for PBR
	float3 N = normalize(input.normal);
	float3 T = normalize(input.tangent);
	T = normalize(T - N * dot(T, N)); // Gram-Schmidt assumes T&N are normalized!
	float3 B = cross(T, N);
	float3x3 TBN = float3x3(T, B, N);

	input.normal = mul(unpackedNormal, TBN); // Note multiplication order!

	float3 V = normalize(cameraPos - input.worldPosition);

	float roughness = RoughnessMap.Sample(BasicSampler, input.uv).r;
	float metalness = MetalnessMap.Sample(BasicSampler, input.uv).r;

	// Calculate the albedo color and tint
	float3 surfaceColor = pow(Albedo.Sample(BasicSampler, input.uv).rgb, 2.2f);
	float3 finColor = surfaceColor * colorTint;

	// Specular color determination -----------------
	// Assume albedo texture is actually holding specular color where metalness == 1
	//
	// Note the use of lerp here - metal is generally 0 or 1, but might be in between
	// because of linear texture sampling, so we lerp the specular color to match
	float3 specularColor = lerp(F0_NON_METAL.rrr, surfaceColor.rgb, metalness);

	return pow(
		DirLight(dirLight1, input.normal, V, roughness, specularColor, metalness, surfaceColor)
		+ DirLight(dirLight2, input.normal, V, roughness, specularColor, metalness, surfaceColor)
		+ DirLight(dirLight3, input.normal, V, roughness, specularColor, metalness, surfaceColor)
		+ PointLight(pointLight1, V, roughness, input.normal, input.worldPosition, specularColor, metalness, surfaceColor)
		+ PointLight(pointLight2, V, roughness, input.normal, input.worldPosition, specularColor, metalness, surfaceColor), 
		1.0f/2.2f);
}