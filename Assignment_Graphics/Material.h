#pragma once
#include "SimpleShader.h"
#include <memory>
#include <unordered_map>

// For the DirectX Math library
using namespace DirectX;

class Material {
private:
	// Three fields, color tint, shared ptrs
	XMFLOAT4 colorTint;
	//float roughness;
	std::shared_ptr<SimpleVertexShader> vertexShader;
	std::shared_ptr<SimplePixelShader> pixelShader;

	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> resourceShader;
	Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler;
	// Hash Tables for variable's texture names
	std::unordered_map<std::string, Microsoft::WRL::ComPtr<ID3D11ShaderResourceView>> textureSRVs;
	std::unordered_map<std::string, Microsoft::WRL::ComPtr<ID3D11SamplerState>> samplers;
public:
	// Pass all fields into constructor, store
	Material(XMFLOAT4 colorTint, std::shared_ptr<SimpleVertexShader> vertexShader,
		std::shared_ptr<SimplePixelShader> pixelShader, Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> resourceShader,
		Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler);

	// Get/Set all fields

	XMFLOAT4 GetColorTint();
	std::shared_ptr<SimpleVertexShader> GetVertexShader();
	std::shared_ptr<SimplePixelShader> GetPixelShader();
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> GetResourceShader();
	Microsoft::WRL::ComPtr<ID3D11SamplerState> GetSampler();
	//float GetRoughness();

	void PrepareMaterial();
	void SetColorTint(XMFLOAT4 colorTint);
	void SetVertexShader(std::shared_ptr<SimpleVertexShader> vertexShader);
	void SetPixelShader(std::shared_ptr<SimplePixelShader> pixelShader);

	void AddTextureSRV(std::string name, Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> SRV);
	void AddSampler(std::string name, Microsoft::WRL::ComPtr<ID3D11SamplerState> samplerSt);
};