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
float4 ApplyBlendMode(thread const float4& color, thread const float2& uv)
{
    float4 ret = color;
    return ret;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 uv = in.g_vary_uv0;
    uv.y = 1.0 - uv.y;
    float4 t_albedo = float4(1.0);
    float4 final_color = t_albedo * buffer._AlbedoColor;
    float2 ndc_coord = in.v_gl_pos.xy / float2(in.v_gl_pos.w);
    float2 screen_coord = (ndc_coord * 0.5) + float2(0.5);
    float4 param = final_color;
    float2 param_1 = screen_coord;
    out.o_fragColor = ApplyBlendMode(param, param_1);
    return out;
}

