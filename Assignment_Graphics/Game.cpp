#include "Game.h"
#include "Vertex.h"
#include "Input.h"
#include "Mesh.h"
#include <memory>
#include <vector>
#include "Material.h"
#include "WICTextureLoader.h"

// Needed for a helper function to read compiled shader files from the hard drive
#pragma comment(lib, "d3dcompiler.lib")
#include <d3dcompiler.h>

// For the DirectX Math library
using namespace DirectX;

// --------------------------------------------------------
// Constructor
//
// DXCore (base class) constructor will set up underlying fields.
// DirectX itself, and our window, are not ready yet!
//
// hInstance - the application's OS-level handle (unique ID)
// --------------------------------------------------------
Game::Game(HINSTANCE hInstance)
	: DXCore(
		hInstance,		   // The application's handle
		"DirectX Game",	   // Text for the window's title bar
		1280,			   // Width of the window's client area
		720,			   // Height of the window's client area
		true),			   // Show extra stats (fps) in title bar?
	vsync(false)
{
#if defined(DEBUG) || defined(_DEBUG)
	// Do we want a console window?  Probably only in debug mode
	CreateConsoleWindow(500, 120, 32, 120);
	printf("Console window created successfully.  Feel free to printf() here.\n");
#endif
}

// --------------------------------------------------------
// Destructor - Clean up anything our game has created:
//  - Release all DirectX objects created here
//  - Delete any objects to prevent memory leaks
// --------------------------------------------------------
Game::~Game()
{
	// Note: Since we're using smart pointers (ComPtr),
	// we don't need to explicitly clean up those DirectX objects
	// - If we weren't using smart pointers, we'd need
	//   to call Release() on each DirectX object created in Game

}

// --------------------------------------------------------
// Called once per program, after DirectX and the window
// are initialized but before the game loop.
// --------------------------------------------------------
void Game::Init()
{
	// Helper methods for loading shaders, creating some basic
	// geometry to draw and some simple camera matrices.
	//  - You'll be expanding and/or replacing these later
	LoadShaders();

	// Load textures
	// Wood PBR
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Wood/wood_albedo.png").c_str(),
		nullptr, &woodAlbedo);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Wood/wood_normals.png").c_str(),
		nullptr, &woodNorm);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Wood/wood_roughness.png").c_str(),
		nullptr, &woodRough);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Wood/wood_metal.png").c_str(),
		nullptr, &woodMetal);

	// Paint PBR
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Paint/paint_albedo.png").c_str(),
		nullptr, &paintAlbedo);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Paint/paint_normals.png").c_str(),
		nullptr, &paintNorm);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Paint/paint_roughness.png").c_str(),
		nullptr, &paintRough);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Paint/paint_metal.png").c_str(),
		nullptr, &paintMetal);

	// Floor PBR
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Floor/floor_albedo.png").c_str(),
		nullptr, &floorAlbedo);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Floor/floor_normals.png").c_str(),
		nullptr, &floorNorm);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Floor/floor_roughness.png").c_str(),
		nullptr, &floorRough);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Floor/floor_metal.png").c_str(),
		nullptr, &floorMetal);

	// Bronze PBR
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Bronze/bronze_albedo.png").c_str(),
		nullptr, &bronzeAlbedo);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Bronze/bronze_normals.png").c_str(),
		nullptr, &bronzeNorm);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Bronze/bronze_roughness.png").c_str(),
		nullptr, &bronzeRough);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Bronze/bronze_metal.png").c_str(),
		nullptr, &bronzeMetal);

	// Cobblestone PBR
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Cobble/cobblestone_albedo.png").c_str(),
		nullptr, &cobbleAlbedo);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Cobble/cobblestone_normals.png").c_str(),
		nullptr, &cobbleNorm);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Cobble/cobblestone_roughness.png").c_str(),
		nullptr, &cobbleRough);
	CreateWICTextureFromFile(device.Get(), context.Get(), GetFullPathTo_Wide(L"../../Assets/Textures/Cobble/cobblestone_metal.png").c_str(),
		nullptr, &cobbleMetal);

	// Zero out the struct
	D3D11_SAMPLER_DESC desc = {};
	// Set addresses U, V, and W to something other than zero
	// These will handles addresses outside of 0-1 UV
	desc.AddressU = D3D11_TEXTURE_ADDRESS_WRAP;
	desc.AddressV = D3D11_TEXTURE_ADDRESS_WRAP;
	desc.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
	desc.Filter = D3D11_FILTER_ANISOTROPIC;
	desc.MaxAnisotropy = 9;
	desc.MaxLOD = D3D11_FLOAT32_MAX;

	device.Get()->CreateSamplerState(&desc, sampler.GetAddressOf());

	// Create materials here - make three - RBG
	redMat = std::make_shared<Material>(XMFLOAT4(1.0f, 0.0f, 0.0f, 1.0f), vertexShader, pixelShader, bronzeAlbedo, sampler);
	redMat->AddTextureSRV("Albedo", bronzeAlbedo);
	redMat->AddTextureSRV("NormalMap", bronzeNorm);
	redMat->AddTextureSRV("RoughnessMap", bronzeRough);
	redMat->AddTextureSRV("MetalnessMap", bronzeMetal);
	redMat->AddSampler("BasicSampler", sampler);

	blueMat = std::make_shared<Material>(XMFLOAT4(0.0f, 1.0f, 0.0f, 1.0f), vertexShader, pixelShader, cobbleAlbedo, sampler);
	blueMat->AddTextureSRV("Albedo", cobbleAlbedo);
	blueMat->AddTextureSRV("NormalMap", cobbleNorm);
	blueMat->AddTextureSRV("RoughnessMap", cobbleRough);
	blueMat->AddTextureSRV("MetalnessMap", cobbleMetal);
	blueMat->AddSampler("BasicSampler", sampler);

	greenMat = std::make_shared<Material>(XMFLOAT4(0.0f, 0.0f, 1.0f, 1.0f), vertexShader, pixelShader, floorAlbedo, sampler);
	greenMat->AddTextureSRV("Albedo", floorAlbedo);
	greenMat->AddTextureSRV("NormalMap", floorNorm);
	greenMat->AddTextureSRV("RoughnessMap", floorRough);
	greenMat->AddTextureSRV("MetalnessMap", floorMetal);
	greenMat->AddSampler("BasicSampler", sampler);

	cyanMat = std::make_shared<Material>(XMFLOAT4(0.0f, 1.0f, 1.0f, 1.0f), vertexShader, pixelShader, woodAlbedo, sampler);
	cyanMat->AddTextureSRV("Albedo", woodAlbedo);
	cyanMat->AddTextureSRV("NormalMap", woodNorm);
	cyanMat->AddTextureSRV("RoughnessMap", woodRough);
	cyanMat->AddTextureSRV("MetalnessMap", woodMetal);
	cyanMat->AddSampler("BasicSampler", sampler);

	purpleMat = std::make_shared<Material>(XMFLOAT4(1.0f, 0.0f, 1.0f, 1.0f), vertexShader, pixelShader, paintAlbedo, sampler);
	purpleMat->AddTextureSRV("Albedo", paintAlbedo);
	purpleMat->AddTextureSRV("NormalMap", paintNorm);
	purpleMat->AddTextureSRV("RoughnessMap", paintRough);
	purpleMat->AddTextureSRV("MetalnessMap", paintMetal);
	purpleMat->AddSampler("BasicSampler", sampler);

	ambient = XMFLOAT3(0.0f, 0.1f, 0.25f);
	dirLight1 = {};
	dirLight1.Type = LIGHT_TYPE_DIRECTIONAL;
	dirLight1.Direction = XMFLOAT3(1, -1, 0);
	dirLight1.Color = XMFLOAT3(1.0f, 1.0f, 0.0f);
	dirLight1.Intensity = 1.0f;

	dirLight2 = {};
	dirLight2.Type = LIGHT_TYPE_DIRECTIONAL;
	dirLight2.Direction = XMFLOAT3(-1, 1, 0);
	dirLight2.Color = XMFLOAT3(1.0f, 0.0f, 0.0f);
	dirLight2.Intensity = 1.0f;

	dirLight3 = {};
	dirLight3.Type = LIGHT_TYPE_DIRECTIONAL;
	dirLight3.Direction = XMFLOAT3(1, 0.5f, 0);
	dirLight3.Color = XMFLOAT3(0.0f, 1.0f, 0.0f);
	dirLight3.Intensity = 1.0f;

	pointLight1 = {};
	pointLight1.Type = LIGHT_TYPE_POINT;
	pointLight1.Color = XMFLOAT3(0.0f, 1.0f, 1.0f);
	pointLight1.Intensity = 1.0f;
	pointLight1.Position = XMFLOAT3(3.0f, 3.0f, 0.0f);
	pointLight1.Range = 3.0f;

	pointLight2 = {};
	pointLight2.Type = LIGHT_TYPE_POINT;
	pointLight2.Color = XMFLOAT3(1.0f, 1.0f, 1.0f);
	pointLight2.Intensity = 1.0f;
	pointLight2.Position = XMFLOAT3(0.0f, 0.0f, -1.0f);
	pointLight2.Range = 3.0f;

	CreateBasicGeometry();

	// Create sky and load texture 
	sky = std::make_shared<Sky>(cube, sampler, device.Get(), context.Get(), GetFullPathTo_Wide(L"SkyVertex.cso"), GetFullPathTo_Wide(L"SkyPixel.cso"));

	sky->CreateCubemap(GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/right.png").c_str(),
		GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/left.png").c_str(),
		GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/up.png").c_str(),
		GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/down.png").c_str(),
		GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/front.png").c_str(),
		GetFullPathTo_Wide(L"../../Assets/Textures/Clouds_Pink/back.png").c_str());

	//sky->LoadDDS(GetFullPathTo_Wide(L"../../Assets/Textures/SunnyCubeMap.dds").c_str());
	
	// Tell the input assembler stage of the pipeline what kind of
	// geometric primitives (points, lines or triangles) we want to draw.  
	// Essentially: "What kind of shape should the GPU draw with our data?"
	context->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);

	// Create camera
	camera = std::make_shared <Camera>((float)this->width / this->height, XMFLOAT3(0,0,-1));
}

// --------------------------------------------------------
// Loads shaders from compiled shader object (.cso) files
// and also created the Input Layout that describes our 
// vertex data to the rendering pipeline. 
// - Input Layout creation is done here because it must 
//    be verified against vertex shader byte code
// - We'll have that byte code already loaded below
// --------------------------------------------------------
void Game::LoadShaders()
{
	vertexShader = std::make_shared<SimpleVertexShader>(device, context, 
		GetFullPathTo_Wide(L"VertexShader.cso").c_str());

	pixelShader = std::make_shared<SimplePixelShader>(device, context,
		GetFullPathTo_Wide(L"PixelShader.cso").c_str());
}



// --------------------------------------------------------
// Creates the geometry we're going to draw - a single triangle for now
// --------------------------------------------------------
void Game::CreateBasicGeometry()
{
	// Set up the vertices of the triangle we would like to draw
	// - We're going to copy this array, exactly as it exists in memory
	//    over to a DirectX-controlled data structure (the vertex buffer)
	// - Note: Since we don't have a camera or really any concept of
	//    a "3d world" yet, we're simply describing positions within the
	//    bounds of how the rasterizer sees our screen: [-1 to +1] on X and Y
	// - This means (0,0) is at the very center of the screen.
	// - These are known as "Normalized Device Coordinates" or "Homogeneous 
	//    Screen Coords", which are ways to describe a position without
	//    knowing the exact size (in pixels) of the image/window/etc.  
	// - Long story short: Resizing the window also resizes the triangle,
	//    since we're describing the triangle in terms of the window itself

	cube = std::make_shared<Mesh>(GetFullPathTo("../../Assets/Models/cube.obj").c_str(), device, context);
	cubeEnt = std::make_shared<Entity>(cube, redMat);
	cubeEnt->GetTransform()->SetScale(.25f,.25f,.25f);
	cubeEnt->GetTransform()->SetPosition(1.0f, 0, 0);
	cubeEnt->GetTransform()->SetRotation(0, 0, 0);

	sphere = std::make_shared<Mesh>(GetFullPathTo("../../Assets/Models/sphere.obj").c_str(), device, context);
	sphereEnt = std::make_shared<Entity>(sphere, blueMat);
	sphereEnt->GetTransform()->SetScale(.25f, .25f, .25f);
	sphereEnt->GetTransform()->SetPosition(0, 0, 0);
	sphereEnt->GetTransform()->SetRotation(0, 0, 0);

	cylinder = std::make_shared<Mesh>(GetFullPathTo("../../Assets/Models/cylinder.obj").c_str(), device, context);
	cylinderEnt = std::make_shared<Entity>(cylinder, greenMat);
	cylinderEnt->GetTransform()->SetScale(.25f, .25f, .25f);
	cylinderEnt->GetTransform()->SetPosition(-1.0f, 0, 0);
	cylinderEnt->GetTransform()->SetRotation(0, 0, 0);

	torus = std::make_shared<Mesh>(GetFullPathTo("../../Assets/Models/torus.obj").c_str(), device, context);
	torusEnt = std::make_shared<Entity>(torus, cyanMat);
	torusEnt->GetTransform()->SetScale(.25f, .25f, .25f);
	torusEnt->GetTransform()->SetPosition(-2.0f, 0, 0);
	torusEnt->GetTransform()->SetRotation(0, 0, 0);

	helix = std::make_shared<Mesh>(GetFullPathTo("../../Assets/Models/helix.obj").c_str(), device, context);
	helixEnt = std::make_shared<Entity>(helix, purpleMat);
	helixEnt->GetTransform()->SetScale(.25f, .25f, .25f);
	helixEnt->GetTransform()->SetPosition(2.0f, 0, 0);
	helixEnt->GetTransform()->SetRotation(0, 0, 0);

	entList = { cubeEnt, sphereEnt, cylinderEnt, torusEnt, helixEnt};
}


// --------------------------------------------------------
// Handle resizing DirectX "stuff" to match the new window size.
// For instance, updating our projection matrix's aspect ratio.
// --------------------------------------------------------
void Game::OnResize()
{
	// Handle base-level DX resize stuff
	DXCore::OnResize();

	if (camera != 0)
	{
		camera->UpdateProjectionMatrix((float)this->width / this->height);
	}
}

// --------------------------------------------------------
// Update your game here - user input, move objects, AI, etc.
// --------------------------------------------------------
void Game::Update(float deltaTime, float totalTime)
{
	// Example input checking: Quit if the escape key is pressed
	if (Input::GetInstance().KeyDown(VK_ESCAPE))
		Quit();

	/*// Make entities move
	int count = 1;
	for (std::shared_ptr<Entity> e : entList)
	{
		// Different transformations to show all 5 entities
		if (count == 1)
		{
			// Will move one set of objects up
			e->GetTransform()->MoveAbsolute(0, .02 * deltaTime, 0);
		}
		else {
			// Will move the other set right
			e->GetTransform()->MoveAbsolute(.02 * deltaTime, 0, 0);
		}

		// Keep count between 1 and 2
		if (count == 1)
		{
			count++;
		}
		else
		{
			count--;
		}
	}*/

	// Update camera
	camera->Update(deltaTime);
}

// --------------------------------------------------------
// Clear the screen, redraw everything, present to the user
// --------------------------------------------------------
void Game::Draw(float deltaTime, float totalTime)
{
	// Background color (Cornflower Blue in this case) for clearing
	const float color[4] = { 0.0f, 0.05f, 0.2f, 0.0f };

	// Clear the render target and depth buffer (erases what's on the screen)
	//  - Do this ONCE PER FRAME
	//  - At the beginning of Draw (before drawing *anything*)
	context->ClearRenderTargetView(backBufferRTV.Get(), color);
	context->ClearDepthStencilView(
		depthStencilView.Get(),
		D3D11_CLEAR_DEPTH | D3D11_CLEAR_STENCIL,
		1.0f,
		0);

	// Draw entities to screen
	for(std::shared_ptr<Entity> e : entList)
	{
		// Pixel shader values
		//pixelShader->SetFloat("roughness", e->GetMaterial()->GetRoughness());
		pixelShader->SetFloat3("cameraPos", camera->GetTransform()->GetPosition());
		e->GetMaterial()->GetPixelShader()->SetFloat3("ambient", ambient);
		pixelShader->SetData("dirLight1", &dirLight1, sizeof(Light)); 
		pixelShader->SetData("dirLight2", &dirLight2, sizeof(Light));
		pixelShader->SetData("dirLight3", &dirLight3, sizeof(Light));
		pixelShader->SetData("pointLight1", &pointLight1, sizeof(Light));
		pixelShader->SetData("pointLight2", &pointLight2, sizeof(Light));

		// Call Draw method of entity
		e->Draw(context, camera);


	}
	// Draw sky AFTER entities
	sky->Draw(camera);

	// Present the back buffer to the user
	//  - Puts the final frame we're drawing into the window so the user can see it
	//  - Do this exactly ONCE PER FRAME (always at the very end of the frame)
	swapChain->Present(vsync ? 1 : 0, 0);

	// Due to the usage of a more sophisticated swap chain,
	// the render target must be re-bound after every call to Present()
	context->OMSetRenderTargets(1, backBufferRTV.GetAddressOf(), depthStencilView.Get());
}