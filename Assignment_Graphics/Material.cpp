#include "Material.h"

Material::Material(XMFLOAT4 colorTint, std::shared_ptr<SimpleVertexShader> vertexShader, std::shared_ptr<SimplePixelShader> pixelShader,
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> resourceShader, Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler)
{
	this->colorTint = colorTint;

	/*// Max and min val
	if (roughness > 1)
	{
		roughness = 1;
	}
	else if (roughness < 0)
	{
		roughness = 0;
	}
	this->roughness = roughness;*/

	this->vertexShader = vertexShader;
	this->pixelShader = pixelShader;
	this->resourceShader = resourceShader;
	this->sampler = sampler;
}

XMFLOAT4 Material::GetColorTint()
{
	return colorTint;
}

std::shared_ptr<SimpleVertexShader> Material::GetVertexShader()
{
	return vertexShader;
}

std::shared_ptr<SimplePixelShader> Material::GetPixelShader()
{
	return pixelShader;
}

Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> Material::GetResourceShader()
{
	return resourceShader;
}

Microsoft::WRL::ComPtr<ID3D11SamplerState> Material::GetSampler()
{
	return sampler;
}

/*
float Material::GetRoughness()
{
	return roughness;
}*/

void Material::PrepareMaterial()
{
	for (auto& t : textureSRVs) { pixelShader->SetShaderResourceView(t.first.c_str(), t.second); }
	for (auto& s : samplers) { pixelShader->SetSamplerState(s.first.c_str(), s.second); }
}

void Material::SetColorTint(XMFLOAT4 colorTint)
{
	this->colorTint = colorTint;
}

void Material::SetVertexShader(std::shared_ptr<SimpleVertexShader> vertexShader)
{
	this->vertexShader = vertexShader;
}

void Material::SetPixelShader(std::shared_ptr<SimplePixelShader> pixelShader)
{
	this->pixelShader = pixelShader;
}


void Material::AddTextureSRV(std::string name, Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> SRV)
{
	textureSRVs.insert({name, SRV});
}

void Material::AddSampler(std::string name, Microsoft::WRL::ComPtr<ID3D11SamplerState> samplerSt)
{
	samplers.insert({name, samplerSt});
}

