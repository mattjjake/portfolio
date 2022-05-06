#include "Helper.hlsli"

cbuffer ExternalData : register(b0)
{
	// Make sure variables are in correct order
	// They must fit into 4 bytes nicely. A float4 then 3 does this. 
	float4 colorTint;
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
	return colorTint + Random(input.screenPosition.xy);
}
