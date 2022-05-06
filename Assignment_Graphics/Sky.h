#pragma once
#include <wrl/client.h> // Used for ComPtr - a smart pointer for COM objects
#include "DXCore.h"
#include <DirectXMath.h>
#include <memory>
#include "Mesh.h"
#include "SimpleShader.h"
#include "WICTextureLoader.h"
#include "DDSTextureLoader.h"
#include "Camera.h"

// For the DirectX Math library
using namespace DirectX;

// Class for handling the Skybox
class Sky 
{
private:
	// Sampler, SRV, buffer and rasterizer
	Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> cubeSRV;
	Microsoft::WRL::ComPtr<ID3D11DepthStencilState> stencil;
	Microsoft::WRL::ComPtr<ID3D11RasterizerState> rasterizer;

	// Device var with how im doing functions - why keep passing it in?
	Microsoft::WRL::ComPtr<ID3D11Device> device;
	Microsoft::WRL::ComPtr<ID3D11DeviceContext> context;

	// Mesh for geometry, and the simpleshader to pass values through pipeline
	std::shared_ptr<Mesh> skyMesh;
	std::shared_ptr<SimplePixelShader> pixelShader;
	std::shared_ptr<SimpleVertexShader> vertexShader;

public:
	// Constructor which takes the mesh, sampler, device, and filepath
	Sky(std::shared_ptr<Mesh> skyMesh, Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler, Microsoft::WRL::ComPtr<ID3D11Device> device,
		Microsoft::WRL::ComPtr<ID3D11DeviceContext> context, std::wstring vertexShaderPath, std::wstring pixelShaderPath);

	// Deconstructor
	~Sky();

	// Cubemap helper
	void CreateCubemap(const wchar_t* right,
		const wchar_t* left,
		const wchar_t* up,
		const wchar_t* down,
		const wchar_t* front,
		const wchar_t* back);

	void LoadDDS(std::wstring filePath);

	void Draw(std::shared_ptr<Camera> camera);
};