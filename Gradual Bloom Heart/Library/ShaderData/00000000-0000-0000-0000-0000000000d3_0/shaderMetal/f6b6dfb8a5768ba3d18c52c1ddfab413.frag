#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float _Intensity;
};

struct main0_out
{
    float4 o_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0;
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> _MainTex [[texture(0)]], texture2d<float> _LutTexture [[texture(1)]], sampler _MainTexSmplr [[sampler(0)]], sampler _LutTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 color = _MainTex.sample(_MainTexSmplr, in.uv0);
    float blueColor = color.z * 63.0;
    float2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);
    float2 texPos1;
    texPos1.x = ((quad1.x * 0.125) + 0.0009765625) + (0.123046875 * color.x);
    texPos1.y = ((quad1.y * 0.125) + 0.0009765625) + (0.123046875 * color.y);
    float4 newColor = _LutTexture.sample(_LutTextureSmplr, texPos1);
    float3 _85 = mix(color.xyz, newColor.xyz, float3(buffer._Intensity * color.w));
    color = float4(_85.x, _85.y, _85.z, color.w);
    out.o_FragColor = color;
    return out;
}

