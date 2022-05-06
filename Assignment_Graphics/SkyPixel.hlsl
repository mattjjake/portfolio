#include "Helper.hlsli"

// Needs cubemap and a sampler
TextureCube CubeMap : register(t0);
SamplerState BasicSampler : register(s0);

float4 main(VertexToPixel_Sky input) : SV_TARGET
{
	return CubeMap.Sample(BasicSampler, input.sampleDir);
}