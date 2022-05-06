#pragma once
#include "SimpleShader.h"
#include "DXCore.h"
#include <DirectXMath.h>
#include <wrl/client.h> // Used for ComPtr - a smart pointer for COM objects
#include <memory>
#include "Mesh.h"
#include "Entity.h"
#include <vector>
#include "Camera.h"
#include "Lights.h"
#include "Sky.h"

class Game 
	: public DXCore
{

public:
	Game(HINSTANCE hInstance);
	~Game();

	// Overridden setup and game loop methods, which
	// will be called automatically
	void Init();
	void OnResize();
	void Update(float deltaTime, float totalTime);
	void Draw(float deltaTime, float totalTime);

private:
	// MODELS -------------------------------------------
	// 3 private shared pointed
	std::shared_ptr<Mesh> cube;
	std::shared_ptr<Mesh> sphere;
	std::shared_ptr<Mesh> cylinder;
	std::shared_ptr<Mesh> torus;
	std::shared_ptr<Mesh> helix;

	// Materials
	std::shared_ptr<Material> redMat;
	std::shared_ptr<Material> blueMat;
	std::shared_ptr<Material> greenMat;
	std::shared_ptr<Material> cyanMat;
	std::shared_ptr<Material> purpleMat;

	// 5 entities
	std::shared_ptr<Entity> cubeEnt;
	std::shared_ptr<Entity> sphereEnt;
	std::shared_ptr<Entity> cylinderEnt;
	std::shared_ptr<Entity> torusEnt;
	std::shared_ptr<Entity> helixEnt;

	// LIGHTING -------------------------------------------
	XMFLOAT3 ambient;
	Light dirLight1;
	Light dirLight2;
	Light dirLight3;

	Light pointLight1;
	Light pointLight2;

	// OTHERS -------------------------------------------
	//store in vector
	std::vector<std::shared_ptr<Entity>> entList;

	// Create camera and sky
	std::shared_ptr<Camera> camera;
	std::shared_ptr<Sky> sky;

	// Should we use vsync to limit the frame rate?
	bool vsync;

	// Initialization helper methods - feel free to customize, combine, etc.
	void LoadShaders(); 
	void CreateBasicGeometry();

	// Note the usage of ComPtr below
	//  - This is a smart pointer for objects that abide by the
	//    Component Object Model, which DirectX objects do
	//  - More info here: https://github.com/Microsoft/DirectXTK/wiki/ComPtr
	
	// Shaders and shader-related constructs
	std::shared_ptr<SimplePixelShader> pixelShader;
	std::shared_ptr<SimpleVertexShader> vertexShader;

	// Cobble PBR
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> cobbleAlbedo;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> cobbleNorm;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> cobbleRough;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> cobbleMetal;

	// Bronze PBR
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> bronzeAlbedo;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> bronzeNorm;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> bronzeRough;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> bronzeMetal;

	// Wood PBR
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> woodAlbedo;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> woodNorm;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> woodRough;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> woodMetal;

	// Paint PBR
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> paintAlbedo;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> paintNorm;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> paintRough;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> paintMetal;

	// Floor PBR
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> floorAlbedo;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> floorNorm;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> floorRough;
	Microsoft::WRL::ComPtr<ID3D11ShaderResourceView> floorMetal;

	Microsoft::WRL::ComPtr<ID3D11SamplerState> sampler;
};

