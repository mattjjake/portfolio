#pragma once

#include <d3d11.h>
#include <wrl/client.h>
#include "Vertex.h"

class Mesh
{
	private:
		// Two private buffers, vertex and index
		Microsoft::WRL::ComPtr<ID3D11Buffer> vertexBuff;
		Microsoft::WRL::ComPtr<ID3D11Buffer> indexBuff;

		// Private ComPtr for draw commands
		Microsoft::WRL::ComPtr<ID3D11DeviceContext> context;

		// Int to hold indicies in mesh's index buffer
		int indicies;

	public:
		/* 
			Constructor - Params of array of vertex obj, int of verticies, array of unsigned int
			Int for numbers of indicies, ComPtr to device and device context 
		*/
		Mesh(Vertex* vertexArr, int vertexCount, unsigned int* indexArr, int indexCount,
			Microsoft::WRL::ComPtr<ID3D11Device> device, Microsoft::WRL::ComPtr<ID3D11DeviceContext> context);

		/* 
			3D Constructor
		*/
		Mesh(const char* fileName, Microsoft::WRL::ComPtr<ID3D11Device> device, Microsoft::WRL::ComPtr<ID3D11DeviceContext> context);
		void CalculateTangents(Vertex* verts, int numVerts, unsigned int* indices, int numIndices);
		// Deconstructor - empty
		~Mesh();

		// Return pointer to vertex buffer obj
		Microsoft::WRL::ComPtr<ID3D11Buffer> GetVertexBuffer();

		// Return pointer to index buffer obj
		Microsoft::WRL::ComPtr<ID3D11Buffer> GetIndexBuffer();

		// Return indicies of the mesh
		int GetIndexCount();

		// Set buffers and give DirectX correct indicies
		void Draw();
};