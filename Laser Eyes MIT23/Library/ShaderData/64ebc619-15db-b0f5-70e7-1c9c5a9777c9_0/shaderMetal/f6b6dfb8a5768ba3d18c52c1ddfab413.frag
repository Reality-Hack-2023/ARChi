#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 _AlbedoColor;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 g_vary_uv0;
    float4 v_gl_pos;
};

static inline __attribute__((always_inline))
float4 TextureFromFBO(thread const float2& uv, texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr)
{
    float4 result = u_FBOTexture.sample(u_FBOTextureSmplr, uv);
    return result;
}

static inline __attribute__((always_inline))
float3 BlendLinearDodge(thread const float3& base, thread const float3& blend)
{
    return fast::min(base + blend, float3(1.0));
}

static inline __attribute__((always_inline))
float3 BlendLinearDodge(thread const float3& base, thread const float3& blend, thread const float& opacity)
{
    float3 param = base;
    float3 param_1 = blend;
    return (BlendLinearDodge(param, param_1) * opacity) + (base * (1.0 - opacity));
}

static inline __attribute__((always_inline))
float4 ApplyBlendMode(thread const float4& color, thread const float2& uv, texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr)
{
    float4 ret = color;
    float2 param = uv;
    float4 framecolor = TextureFromFBO(param, u_FBOTexture, u_FBOTextureSmplr);
    float3 param_1 = framecolor.xyz;
    float3 param_2 = ret.xyz;
    float param_3 = ret.w;
    float3 _84 = BlendLinearDodge(param_1, param_2, param_3);
    ret = float4(_84.x, _84.y, _84.z, ret.w);
    return ret;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_FBOTexture [[texture(0)]], texture2d<float> _AlbedoTexture [[texture(1)]], sampler u_FBOTextureSmplr [[sampler(0)]], sampler _AlbedoTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 uv = in.g_vary_uv0;
    uv.y = 1.0 - uv.y;
    float4 t_albedo = float4(1.0);
    t_albedo = _AlbedoTexture.sample(_AlbedoTextureSmplr, uv);
    float3 _110 = t_albedo.xyz / float3(t_albedo.w);
    t_albedo = float4(_110.x, _110.y, _110.z, t_albedo.w);
    float4 final_color = t_albedo * buffer._AlbedoColor;
    float2 ndc_coord = in.v_gl_pos.xy / float2(in.v_gl_pos.w);
    float2 screen_coord = (ndc_coord * 0.5) + float2(0.5);
    float4 param = final_color;
    float2 param_1 = screen_coord;
    out.o_fragColor = ApplyBlendMode(param, param_1, u_FBOTexture, u_FBOTextureSmplr);
    return out;
}

