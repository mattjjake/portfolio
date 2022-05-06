#include "Helper.hlsli"

cbuffer ExternalData : register(b0)
{
	// Take in view and projection matrices
	matrix view;
	matrix proj;
}

// Go to pipeline, accepting Input, and returning sky-specific VTP
VertexToPixel_Sky main(VertexShaderInput input)
{
	// set up struct
	VertexToPixel_Sky output;

	// Remove translation of view matrix
	matrix viewNoTranslation = view;
	viewNoTranslation._14 = 0;
	viewNoTranslation._24 = 0;
	viewNoTranslation._34 = 0;

	// Apply proj and view to input, save to output
	matrix vp = mul(proj, viewNoTranslation);
	output.position = mul(vp, float4(input.localPosition, 1.0f));

	// Make dept of each vertex 1 by setting z equal to w
	output.position.z = output.position.w;

	// Just the input position
	output.sampleDir = input.localPosition;

	// Return struct
	return output;
}