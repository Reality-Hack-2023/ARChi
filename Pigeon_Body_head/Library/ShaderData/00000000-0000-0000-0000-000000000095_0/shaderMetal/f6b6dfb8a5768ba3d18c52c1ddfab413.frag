#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    spvUnsafeArray<float4, 3> u_DirLightsDirection;
    float4x4 u_DirLight0ShadowMatrix;
    float4 u_DirLight0ShadowColor;
    float u_DirLight0ShadowBias;
    float2 u_DirLight0ShadowTextureSize;
    float u_DirLight0ShadowSoft;
    float u_DirLight0ShadowSoftness;
    float u_DirLight0SelfShadowGradient;
    float u_DirLight0ShadowStrength;
    spvUnsafeArray<float, 3> u_DirLightsEnabled;
    float u_DirLightNum;
};

struct main0_out
{
    float4 glResult [[color(0)]];
};

struct main0_in
{
    float3 g_worldPos;
    float3 g_worldNormal;
};

static inline __attribute__((always_inline))
float rand(thread const float2& co)
{
    return fract(sin(dot(co, float2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

static inline __attribute__((always_inline))
float DecodeFloat(float4 value)
{
    return dot(value, float4(1.52587890625e-05, 0.00390625, 1.0, 0.0));
}

static inline __attribute__((always_inline))
float4 Shadowing(thread const float3& worldPosition, thread const float3& worldNormal, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant float4x4& u_DirLight0ShadowMatrix, constant float4& u_DirLight0ShadowColor, constant float& u_DirLight0ShadowBias, constant float2& u_DirLight0ShadowTextureSize, constant float& u_DirLight0ShadowSoft, texture2d<float> u_DirLight0ShadowTexture, sampler u_DirLight0ShadowTextureSmplr, constant float& u_DirLight0ShadowSoftness, constant float& u_DirLight0SelfShadowGradient, constant float& u_DirLight0ShadowStrength)
{
    float nl = fast::max(dot(worldNormal, -u_DirLightsDirection[0].xyz), 0.0);
    float4 proj_pos = u_DirLight0ShadowMatrix * float4(worldPosition, 1.0);
    float3 shadow_coord = proj_pos.xyz / float3(proj_pos.w);
    bool _84 = shadow_coord.x < 0.0;
    bool _92;
    if (!_84)
    {
        _92 = shadow_coord.y < 0.0;
    }
    else
    {
        _92 = _84;
    }
    bool _99;
    if (!_92)
    {
        _99 = shadow_coord.x > 1.0;
    }
    else
    {
        _99 = _92;
    }
    bool _106;
    if (!_99)
    {
        _106 = shadow_coord.y > 1.0;
    }
    else
    {
        _106 = _99;
    }
    if (_106)
    {
        return float4(u_DirLight0ShadowColor.xyz, 1.0);
    }
    shadow_coord.z = fast::clamp(shadow_coord.z, 0.0, 1.0);
    float bias0 = u_DirLight0ShadowBias + fast::clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    bias0 = fast::clamp(bias0, 0.0, 1.0);
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    float shadow_alpha = 0.0;
    float2 inv_tex_size = float2(1.0) / u_DirLight0ShadowTextureSize;
    float inv_num = 0.0625;
    if (u_DirLight0ShadowSoft > 0.0)
    {
        for (int i = 0; i < 4; i++)
        {
            float float_i = float(i);
            for (int j = 0; j < 4; j++)
            {
                float float_j = float(j);
                float2 param = shadow_coord.xy + float2(float_i, float_j);
                float jitter_x = rand(param);
                float2 param_1 = shadow_coord.xy + float2(float_i * 2.0, float_j * 3.0);
                float jitter_y = rand(param_1);
                float r = sqrt(float_i + jitter_x);
                float theta = (6.28318023681640625 * (float(j) + jitter_y)) * inv_num;
                float4 data = u_DirLight0ShadowTexture.sample(u_DirLight0ShadowTextureSmplr, (shadow_coord.xy + ((float2(r * cos(theta), r * sin(theta)) * u_DirLight0ShadowSoftness) * inv_tex_size)));
                float depth = DecodeFloat(data);
                float noShadow = float(shadow_coord.z <= (depth + bias0));
                shadow_sum += noShadow;
                shadow_alpha += fast::max(data.w, noShadow);
            }
        }
        shadow_factor = shadow_sum / 16.0;
        shadow_alpha /= 16.0;
    }
    else
    {
        float4 data_1 = u_DirLight0ShadowTexture.sample(u_DirLight0ShadowTextureSmplr, shadow_coord.xy);
        float depth_1 = DecodeFloat(data_1);
        float noShadow_1 = float(shadow_coord.z <= (depth_1 + bias0));
        shadow_factor = noShadow_1;
        shadow_alpha = fast::max(data_1.w, noShadow_1);
    }
    if (u_DirLight0SelfShadowGradient > 9.9999997473787516355514526367188e-05)
    {
        shadow_factor = fast::min(fast::clamp((nl - 0.00872653536498546600341796875) * u_DirLight0SelfShadowGradient, 0.0, 1.0), shadow_factor);
    }
    if (shadow_factor < 1.0)
    {
        shadow_factor = mix(1.0, shadow_factor, u_DirLight0ShadowStrength * shadow_alpha);
    }
    return float4(u_DirLight0ShadowColor.xyz, shadow_factor);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_DirLight0ShadowTexture [[texture(0)]], sampler u_DirLight0ShadowTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float3 worldNormal = normalize(in.g_worldNormal);
    float4 shadowFactor = float4(1.0);
    float alpha = 1.0;
    float enable = buffer.u_DirLightsEnabled[0] * step(0.5, buffer.u_DirLightNum);
    if (enable > 0.5)
    {
        float3 param = in.g_worldPos;
        float3 param_1 = worldNormal;
        shadowFactor = Shadowing(param, param_1, buffer.u_DirLightsDirection, buffer.u_DirLight0ShadowMatrix, buffer.u_DirLight0ShadowColor, buffer.u_DirLight0ShadowBias, buffer.u_DirLight0ShadowTextureSize, buffer.u_DirLight0ShadowSoft, u_DirLight0ShadowTexture, u_DirLight0ShadowTextureSmplr, buffer.u_DirLight0ShadowSoftness, buffer.u_DirLight0SelfShadowGradient, buffer.u_DirLight0ShadowStrength);
        alpha = 1.0 - shadowFactor.w;
    }
    out.glResult = float4(shadowFactor.xyz, alpha);
    return out;
}

