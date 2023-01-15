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

struct SurfaceParams
{
    float3 albedo;
    float3 nDir;
    float3 pos;
    float3 emissive;
};

struct LightParams
{
    float enable;
    float3 lDir;
    float3 color;
    float intensity;
    float3 attenuate;
};

struct SoftShadowParams
{
    float3 shadowUV;
    float2 offsetUV;
    float depth;
    float positiveExp;
    float negativeExp;
    float mipmapLevel;
    float bias0;
    float softness;
    float2 _textureSize;
};

struct LightGroupParams
{
    spvUnsafeArray<LightParams, 3> DirLights;
    spvUnsafeArray<LightParams, 8> PointLights;
    spvUnsafeArray<LightParams, 8> SpotLights;
    float dummy;
};

struct buffer_t
{
    float4x4 u_DirLight0ShadowMatrix;
    float4 u_DirLight0ShadowColor;
    float u_DirLight0ShadowBias;
    float2 u_DirLight0ShadowTextureSize;
    float u_DirLight0ShadowSoft;
    float u_DirLight0ShadowSoftness;
    float u_DirLight0SelfShadowGradient;
    float u_DirLight0ShadowStrength;
    float4x4 u_SpotLight0ShadowMatrix;
    float u_SpotLight0ShadowBias;
    float u_SpotLight0ShadowSoftness;
    float2 u_SpotLight0ShadowTextureSize;
    float4 u_SpotLight0ShadowColor;
    float u_SpotLight0ShadowSoft;
    float u_SpotLight0ShadowStrength;
    spvUnsafeArray<float4, 8> u_PointLightsPosition;
    float u_PointLight0ShadowBias;
    float2 u_PointLight0ShadowBoundingBoxSize;
    float u_PointLight0ShadowSoftness;
    float2 u_PointLight0ShadowTextureSize;
    float u_PointLight0ShadowSoft;
    float4 u_PointLight0ShadowColor;
    spvUnsafeArray<float, 3> u_DirLightsEnabled;
    float u_DirLightNum;
    spvUnsafeArray<float4, 3> u_DirLightsDirection;
    spvUnsafeArray<float4, 3> u_DirLightsColor;
    spvUnsafeArray<float, 3> u_DirLightsIntensity;
    spvUnsafeArray<float, 8> u_PointLightsEnabled;
    float u_PointLightNum;
    spvUnsafeArray<float4, 8> u_PointLightsColor;
    spvUnsafeArray<float, 8> u_PointLightsIntensity;
    spvUnsafeArray<float, 8> u_PointLightsAttenRangeInv;
    spvUnsafeArray<float, 8> u_SpotLightsEnabled;
    float u_SpotLightNum;
    spvUnsafeArray<float4, 8> u_SpotLightsPosition;
    spvUnsafeArray<float4, 8> u_SpotLightsColor;
    spvUnsafeArray<float, 8> u_SpotLightsIntensity;
    spvUnsafeArray<float, 8> u_SpotLightsAttenRangeInv;
    spvUnsafeArray<float4, 8> u_SpotLightsDirection;
    spvUnsafeArray<float, 8> u_SpotLightsOuterAngleCos;
    spvUnsafeArray<float, 8> u_SpotLightsInnerAngleCos;
    float4 _AlbedoColor;
    float4 _AmbientColor;
    float _AmbientIntensity;
};

constant spvUnsafeArray<float3, 20> _868 = spvUnsafeArray<float3, 20>({ float3(1.0), float3(1.0, -1.0, 1.0), float3(-1.0, -1.0, 1.0), float3(-1.0, 1.0, 1.0), float3(1.0, 1.0, -1.0), float3(1.0, -1.0, -1.0), float3(-1.0), float3(-1.0, 1.0, -1.0), float3(1.0, 1.0, 0.0), float3(1.0, -1.0, 0.0), float3(-1.0, -1.0, 0.0), float3(-1.0, 1.0, 0.0), float3(1.0, 0.0, 1.0), float3(-1.0, 0.0, 1.0), float3(1.0, 0.0, -1.0), float3(-1.0, 0.0, -1.0), float3(0.0, 1.0, 1.0), float3(0.0, -1.0, 1.0), float3(0.0, -1.0, -1.0), float3(0.0, 1.0, -1.0) });

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv0;
    float3 v_nDirWS;
    float3 v_posWS;
};

static inline __attribute__((always_inline))
SurfaceParams BuildSurfaceParams(thread const float3& albedo, thread const float3& nDir, thread const float3& pos, thread const float3& emissive)
{
    SurfaceParams S;
    S.albedo = albedo;
    S.nDir = nDir;
    S.pos = pos;
    S.emissive = emissive;
    return S;
}

static inline __attribute__((always_inline))
LightParams BuildDirLightParams(thread const SurfaceParams& S, thread const int& index, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant float& u_DirLightNum, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity)
{
    LightParams ML;
    ML.enable = u_DirLightsEnabled[index] * step(float(index) + 0.5, u_DirLightNum);
    ML.lDir = normalize(-u_DirLightsDirection[index].xyz);
    ML.color = u_DirLightsColor[index].xyz;
    ML.intensity = u_DirLightsIntensity[index] * ML.enable;
    ML.attenuate = float3(1.0);
    return ML;
}

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
float4 Shadowing(thread const SurfaceParams& S, thread const LightParams& L, constant float4x4& u_DirLight0ShadowMatrix, constant float4& u_DirLight0ShadowColor, constant float& u_DirLight0ShadowBias, constant float2& u_DirLight0ShadowTextureSize, constant float& u_DirLight0ShadowSoft, texture2d<float> u_DirLight0ShadowTexture, sampler u_DirLight0ShadowTextureSmplr, constant float& u_DirLight0ShadowSoftness, constant float& u_DirLight0SelfShadowGradient, constant float& u_DirLight0ShadowStrength)
{
    float nl = fast::max(dot(S.nDir, L.lDir), 0.0);
    float4 proj_pos = u_DirLight0ShadowMatrix * float4(S.pos, 1.0);
    float3 shadow_coord = proj_pos.xyz / float3(proj_pos.w);
    bool _341 = shadow_coord.x < 0.0;
    bool _349;
    if (!_341)
    {
        _349 = shadow_coord.y < 0.0;
    }
    else
    {
        _349 = _341;
    }
    bool _356;
    if (!_349)
    {
        _356 = shadow_coord.x > 1.0;
    }
    else
    {
        _356 = _349;
    }
    bool _363;
    if (!_356)
    {
        _363 = shadow_coord.y > 1.0;
    }
    else
    {
        _363 = _356;
    }
    if (_363)
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

static inline __attribute__((always_inline))
float Pow4(thread const float& x)
{
    float x2 = x * x;
    return x2 * x2;
}

static inline __attribute__((always_inline))
float saturate0(thread const float& x)
{
    return fast::clamp(x, 0.0, 1.0);
}

static inline __attribute__((always_inline))
float Pow2(thread const float& x)
{
    return x * x;
}

static inline __attribute__((always_inline))
LightParams BuildPointLightParams(thread const SurfaceParams& S, thread const int& index, constant spvUnsafeArray<float4, 8>& u_PointLightsPosition, constant spvUnsafeArray<float, 8>& u_PointLightsEnabled, constant float& u_PointLightNum, constant spvUnsafeArray<float4, 8>& u_PointLightsColor, constant spvUnsafeArray<float, 8>& u_PointLightsIntensity, constant spvUnsafeArray<float, 8>& u_PointLightsAttenRangeInv)
{
    float3 lVec = float3(0.0);
    float lDist = 0.0;
    LightParams PL1;
    PL1.enable = u_PointLightsEnabled[index] * step(float(index) + 0.5, u_PointLightNum);
    lVec = u_PointLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    PL1.lDir = lVec / float3(lDist);
    PL1.color = u_PointLightsColor[index].xyz;
    PL1.intensity = u_PointLightsIntensity[index] * PL1.enable;
    float lWorldDist = lDist;
    lDist *= u_PointLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate0(param_1);
    float param_3 = lWorldDist;
    float param_4 = 0.00999999977648258209228515625;
    float attenuate = Pow2(param_2) / fast::max(Pow2(param_3), Pow2(param_4));
    PL1.attenuate = float3(attenuate, attenuate, attenuate);
    return PL1;
}

static inline __attribute__((always_inline))
SoftShadowParams GetPointSoftShadowParams(thread const SurfaceParams& S, thread const LightParams& L, constant spvUnsafeArray<float4, 8>& u_PointLightsPosition, constant float& u_PointLight0ShadowBias, constant float2& u_PointLight0ShadowBoundingBoxSize, constant float& u_PointLight0ShadowSoftness, constant float2& u_PointLight0ShadowTextureSize)
{
    float3 fragToLight = S.pos - u_PointLightsPosition[0].xyz;
    float3 coord = normalize(S.pos - u_PointLightsPosition[0].xyz);
    float nl = fast::max(dot(S.nDir, L.lDir), 0.0);
    SoftShadowParams SS;
    SS.bias0 = u_PointLight0ShadowBias + fast::clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    SS.bias0 = fast::clamp(SS.bias0, 0.0, 1.0);
    SS.shadowUV = coord;
    SS.offsetUV = float2(0.0);
    SS.depth = fast::clamp(length(fragToLight) * u_PointLight0ShadowBoundingBoxSize.y, 0.0, 1.0) - SS.bias0;
    SS.softness = u_PointLight0ShadowSoftness;
    SS._textureSize = u_PointLight0ShadowTextureSize;
    return SS;
}

static inline __attribute__((always_inline))
float PointSampleShadowMapUV(thread const float3& shadowUV, thread const float& depth, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr)
{
    float4 arg = u_PointLight0ShadowTexture.sample(u_PointLight0ShadowTextureSmplr, shadowUV);
    float depthInShadowMap = DecodeFloat(arg);
    return step(depth, depthInShadowMap);
}

static inline __attribute__((always_inline))
float PointSampleShadowMapPoisson9(thread const float2& size, thread const float3& uv, thread const float& depth, thread const float& softness, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr)
{
    float result = 0.0;
    float uvStep = (((1.0 / size.x) * softness) * size.x) * 0.00999999977648258209228515625;
    for (int i = 0; i < 20; i++)
    {
        float3 param = uv + (_868[i] * uvStep);
        float param_1 = depth;
        result += PointSampleShadowMapUV(param, param_1, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr);
    }
    return result * 0.0500000007450580596923828125;
}

static inline __attribute__((always_inline))
float PointStaticPoissonPCF(thread const SurfaceParams& S, thread const LightParams& L, thread const SoftShadowParams& SS, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr)
{
    float softness = SS.softness;
    float2 param = SS._textureSize;
    float3 param_1 = SS.shadowUV;
    float param_2 = SS.depth;
    float param_3 = softness;
    return PointSampleShadowMapPoisson9(param, param_1, param_2, param_3, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr);
}

static inline __attribute__((always_inline))
float4 PointShadowing(thread const SurfaceParams& S, thread const LightParams& L, constant spvUnsafeArray<float4, 8>& u_PointLightsPosition, constant float& u_PointLight0ShadowBias, constant float2& u_PointLight0ShadowBoundingBoxSize, constant float& u_PointLight0ShadowSoftness, constant float2& u_PointLight0ShadowTextureSize, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr, constant float& u_PointLight0ShadowSoft, constant float4& u_PointLight0ShadowColor)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    SoftShadowParams SS = GetPointSoftShadowParams(param, param_1, u_PointLightsPosition, u_PointLight0ShadowBias, u_PointLight0ShadowBoundingBoxSize, u_PointLight0ShadowSoftness, u_PointLight0ShadowTextureSize);
    float nl = fast::max(dot(S.nDir, L.lDir), 0.0);
    float shadowVal = 1.0;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    if (u_PointLight0ShadowSoft > 0.0)
    {
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        SoftShadowParams param_4 = SS;
        shadow_factor = PointStaticPoissonPCF(param_2, param_3, param_4, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr);
    }
    else
    {
        float4 data = u_PointLight0ShadowTexture.sample(u_PointLight0ShadowTextureSmplr, SS.shadowUV);
        float depth = DecodeFloat(data);
        float noShadow = float(SS.depth <= depth);
        shadow_factor = noShadow;
    }
    return float4(u_PointLight0ShadowColor.xyz, shadow_factor);
}

static inline __attribute__((always_inline))
LightParams BuildSpotLightParams(thread const SurfaceParams& S, thread const int& index, constant spvUnsafeArray<float, 8>& u_SpotLightsEnabled, constant float& u_SpotLightNum, constant spvUnsafeArray<float4, 8>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 8>& u_SpotLightsColor, constant spvUnsafeArray<float, 8>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 8>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 8>& u_SpotLightsDirection, constant spvUnsafeArray<float, 8>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 8>& u_SpotLightsInnerAngleCos)
{
    float3 lVec = float3(0.0);
    float lDist = 0.0;
    float3 spotDir = float3(0.0);
    float angleAtten = 0.0;
    LightParams SL1;
    SL1.enable = u_SpotLightsEnabled[index] * step(float(index) + 0.5, u_SpotLightNum);
    lVec = u_SpotLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    SL1.lDir = lVec / float3(lDist);
    SL1.color = u_SpotLightsColor[index].xyz;
    SL1.intensity = u_SpotLightsIntensity[index] * SL1.enable;
    float lWorldDist = lDist;
    lDist *= u_SpotLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate0(param_1);
    float param_3 = lWorldDist;
    float param_4 = 0.00999999977648258209228515625;
    float attenuate = Pow2(param_2) / fast::max(Pow2(param_3), Pow2(param_4));
    spotDir = normalize(-u_SpotLightsDirection[index].xyz);
    angleAtten = fast::max(0.0, dot(SL1.lDir, spotDir));
    attenuate *= smoothstep(u_SpotLightsOuterAngleCos[index], u_SpotLightsInnerAngleCos[index], angleAtten);
    SL1.attenuate = float3(attenuate, attenuate, attenuate);
    return SL1;
}

static inline __attribute__((always_inline))
SoftShadowParams GetSpotSoftShadowParams(thread const SurfaceParams& S, thread const LightParams& L, constant float4x4& u_SpotLight0ShadowMatrix, constant float& u_SpotLight0ShadowBias, constant float& u_SpotLight0ShadowSoftness, constant float2& u_SpotLight0ShadowTextureSize)
{
    float4 posSS = u_SpotLight0ShadowMatrix * float4(S.pos, 1.0);
    float3 _583 = posSS.xyz / float3(posSS.w);
    posSS = float4(_583.x, _583.y, _583.z, posSS.w);
    float3 _591 = (posSS.xyz * 0.5) + float3(0.5);
    posSS = float4(_591.x, _591.y, _591.z, posSS.w);
    float nl = fast::max(dot(S.nDir, L.lDir), 0.0);
    SoftShadowParams SS;
    SS.bias0 = u_SpotLight0ShadowBias + fast::clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    SS.bias0 = fast::clamp(SS.bias0, 0.0, 1.0);
    SS.shadowUV = float3(posSS.xy.x, posSS.xy.y, SS.shadowUV.z);
    SS.offsetUV = float2(0.0);
    SS.depth = fast::clamp(posSS.z, 0.0, 1.0) - SS.bias0;
    SS.softness = u_SpotLight0ShadowSoftness;
    SS._textureSize = u_SpotLight0ShadowTextureSize;
    return SS;
}

static inline __attribute__((always_inline))
float StaticPoissonPCF(thread const float2& size, thread const float2& uv, thread const float& depth, thread const float& softness, thread const texture2d<float> shadowmap, thread const sampler shadowmapSmplr)
{
    float result = 0.0;
    float inv_num = 0.0625;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    float shadow_alpha = 0.0;
    for (int i = 0; i < 4; i++)
    {
        float float_i = float(i);
        for (int j = 0; j < 4; j++)
        {
            float float_j = float(j);
            float2 param = uv + float2(float_i, float_j);
            float jitter_x = rand(param);
            float2 param_1 = uv + float2(float_i * 2.0, float_j * 3.0);
            float jitter_y = rand(param_1);
            float r = sqrt(float_i + jitter_x);
            float theta = (6.28318023681640625 * (float(j) + jitter_y)) * inv_num;
            float2 sampleUV = uv + ((float2(r * cos(theta), r * sin(theta)) * softness) / size);
            float4 data = shadowmap.sample(shadowmapSmplr, sampleUV);
            float decodeDepth = DecodeFloat(data);
            float noShadow = float(depth <= decodeDepth);
            shadow_sum += noShadow;
            shadow_alpha += fast::max(data.w, noShadow);
        }
    }
    shadow_factor = shadow_sum / 16.0;
    shadow_alpha /= 16.0;
    return shadow_factor;
}

static inline __attribute__((always_inline))
float4 SpotShadowing(thread const SurfaceParams& S, thread const LightParams& L, constant float4x4& u_SpotLight0ShadowMatrix, constant float& u_SpotLight0ShadowBias, constant float& u_SpotLight0ShadowSoftness, constant float2& u_SpotLight0ShadowTextureSize, constant float4& u_SpotLight0ShadowColor, constant float& u_SpotLight0ShadowSoft, texture2d<float> u_SpotLight0ShadowTexture, sampler u_SpotLight0ShadowTextureSmplr, constant float& u_SpotLight0ShadowStrength)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    SoftShadowParams SS = GetSpotSoftShadowParams(param, param_1, u_SpotLight0ShadowMatrix, u_SpotLight0ShadowBias, u_SpotLight0ShadowSoftness, u_SpotLight0ShadowTextureSize);
    float nl = fast::max(dot(S.nDir, L.lDir), 0.0);
    bool _656 = SS.shadowUV.x < 0.0;
    bool _663;
    if (!_656)
    {
        _663 = SS.shadowUV.y < 0.0;
    }
    else
    {
        _663 = _656;
    }
    bool _670;
    if (!_663)
    {
        _670 = SS.shadowUV.x > 1.0;
    }
    else
    {
        _670 = _663;
    }
    bool _677;
    if (!_670)
    {
        _677 = SS.shadowUV.y > 1.0;
    }
    else
    {
        _677 = _670;
    }
    if (_677)
    {
        return float4(u_SpotLight0ShadowColor.xyz, 1.0);
    }
    float shadowVal = 1.0;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    if (u_SpotLight0ShadowSoft > 0.0)
    {
        float2 param_2 = SS._textureSize;
        float2 param_3 = SS.shadowUV.xy;
        float param_4 = SS.depth;
        float param_5 = SS.softness;
        shadow_factor = StaticPoissonPCF(param_2, param_3, param_4, param_5, u_SpotLight0ShadowTexture, u_SpotLight0ShadowTextureSmplr);
    }
    else
    {
        float4 data = u_SpotLight0ShadowTexture.sample(u_SpotLight0ShadowTextureSmplr, SS.shadowUV.xy);
        float depth = DecodeFloat(data);
        float noShadow = float(SS.depth <= depth);
        shadow_factor = noShadow;
    }
    if (shadow_factor < 1.0)
    {
        shadow_factor = mix(1.0, shadow_factor, u_SpotLight0ShadowStrength);
    }
    return float4(u_SpotLight0ShadowColor.xyz, shadow_factor);
}

static inline __attribute__((always_inline))
LightGroupParams BuildLightGroupParams(thread const SurfaceParams& S, constant float4x4& u_DirLight0ShadowMatrix, constant float4& u_DirLight0ShadowColor, constant float& u_DirLight0ShadowBias, constant float2& u_DirLight0ShadowTextureSize, constant float& u_DirLight0ShadowSoft, texture2d<float> u_DirLight0ShadowTexture, sampler u_DirLight0ShadowTextureSmplr, constant float& u_DirLight0ShadowSoftness, constant float& u_DirLight0SelfShadowGradient, constant float& u_DirLight0ShadowStrength, constant float4x4& u_SpotLight0ShadowMatrix, constant float& u_SpotLight0ShadowBias, constant float& u_SpotLight0ShadowSoftness, constant float2& u_SpotLight0ShadowTextureSize, constant float4& u_SpotLight0ShadowColor, constant float& u_SpotLight0ShadowSoft, texture2d<float> u_SpotLight0ShadowTexture, sampler u_SpotLight0ShadowTextureSmplr, constant float& u_SpotLight0ShadowStrength, constant spvUnsafeArray<float4, 8>& u_PointLightsPosition, constant float& u_PointLight0ShadowBias, constant float2& u_PointLight0ShadowBoundingBoxSize, constant float& u_PointLight0ShadowSoftness, constant float2& u_PointLight0ShadowTextureSize, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr, constant float& u_PointLight0ShadowSoft, constant float4& u_PointLight0ShadowColor, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant float& u_DirLightNum, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity, constant spvUnsafeArray<float, 8>& u_PointLightsEnabled, constant float& u_PointLightNum, constant spvUnsafeArray<float4, 8>& u_PointLightsColor, constant spvUnsafeArray<float, 8>& u_PointLightsIntensity, constant spvUnsafeArray<float, 8>& u_PointLightsAttenRangeInv, constant spvUnsafeArray<float, 8>& u_SpotLightsEnabled, constant float& u_SpotLightNum, constant spvUnsafeArray<float4, 8>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 8>& u_SpotLightsColor, constant spvUnsafeArray<float, 8>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 8>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 8>& u_SpotLightsDirection, constant spvUnsafeArray<float, 8>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 8>& u_SpotLightsInnerAngleCos)
{
    LightGroupParams LG;
    LG.dummy = 0.0;
    SurfaceParams param = S;
    int param_1 = 0;
    LG.DirLights[0] = BuildDirLightParams(param, param_1, u_DirLightsEnabled, u_DirLightNum, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
    if (LG.DirLights[0].enable > 0.5)
    {
        SurfaceParams param_2 = S;
        LightParams param_3 = LG.DirLights[0];
        float4 shadowFactor = Shadowing(param_2, param_3, u_DirLight0ShadowMatrix, u_DirLight0ShadowColor, u_DirLight0ShadowBias, u_DirLight0ShadowTextureSize, u_DirLight0ShadowSoft, u_DirLight0ShadowTexture, u_DirLight0ShadowTextureSmplr, u_DirLight0ShadowSoftness, u_DirLight0SelfShadowGradient, u_DirLight0ShadowStrength);
        LG.DirLights[0].attenuate = mix(shadowFactor.xyz, LG.DirLights[0].attenuate, float3(shadowFactor.w));
    }
    SurfaceParams param_4 = S;
    int param_5 = 1;
    LG.DirLights[1] = BuildDirLightParams(param_4, param_5, u_DirLightsEnabled, u_DirLightNum, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
    SurfaceParams param_6 = S;
    int param_7 = 2;
    LG.DirLights[2] = BuildDirLightParams(param_6, param_7, u_DirLightsEnabled, u_DirLightNum, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity);
    SurfaceParams param_8 = S;
    int param_9 = 0;
    LG.PointLights[0] = BuildPointLightParams(param_8, param_9, u_PointLightsPosition, u_PointLightsEnabled, u_PointLightNum, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv);
    if (LG.PointLights[0].enable > 0.5)
    {
        SurfaceParams param_10 = S;
        LightParams param_11 = LG.PointLights[0];
        float4 pointShadowFactor = PointShadowing(param_10, param_11, u_PointLightsPosition, u_PointLight0ShadowBias, u_PointLight0ShadowBoundingBoxSize, u_PointLight0ShadowSoftness, u_PointLight0ShadowTextureSize, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr, u_PointLight0ShadowSoft, u_PointLight0ShadowColor);
        LG.PointLights[0].attenuate = mix(pointShadowFactor.xyz, LG.PointLights[0].attenuate, float3(pointShadowFactor.w));
    }
    SurfaceParams param_12 = S;
    int param_13 = 1;
    LG.PointLights[1] = BuildPointLightParams(param_12, param_13, u_PointLightsPosition, u_PointLightsEnabled, u_PointLightNum, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv);
    SurfaceParams param_14 = S;
    int param_15 = 2;
    LG.PointLights[2] = BuildPointLightParams(param_14, param_15, u_PointLightsPosition, u_PointLightsEnabled, u_PointLightNum, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv);
    SurfaceParams param_16 = S;
    int param_17 = 0;
    LG.SpotLights[0] = BuildSpotLightParams(param_16, param_17, u_SpotLightsEnabled, u_SpotLightNum, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
    if (LG.SpotLights[0].enable > 0.5)
    {
        SurfaceParams param_18 = S;
        LightParams param_19 = LG.SpotLights[0];
        float4 spotShadowFactor = SpotShadowing(param_18, param_19, u_SpotLight0ShadowMatrix, u_SpotLight0ShadowBias, u_SpotLight0ShadowSoftness, u_SpotLight0ShadowTextureSize, u_SpotLight0ShadowColor, u_SpotLight0ShadowSoft, u_SpotLight0ShadowTexture, u_SpotLight0ShadowTextureSmplr, u_SpotLight0ShadowStrength);
        LG.SpotLights[0].attenuate = mix(spotShadowFactor.xyz, LG.SpotLights[0].attenuate, float3(spotShadowFactor.w));
    }
    SurfaceParams param_20 = S;
    int param_21 = 1;
    LG.SpotLights[1] = BuildSpotLightParams(param_20, param_21, u_SpotLightsEnabled, u_SpotLightNum, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
    SurfaceParams param_22 = S;
    int param_23 = 2;
    LG.SpotLights[2] = BuildSpotLightParams(param_22, param_23, u_SpotLightsEnabled, u_SpotLightNum, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
    return LG;
}

static inline __attribute__((always_inline))
float3 Diffuse_Low(thread const SurfaceParams& S, thread const LightParams& L)
{
    float3 lightDir = L.lDir;
    float diff = fast::max(dot(lightDir, S.nDir), 0.0);
    float3 diffuse = (((S.albedo * diff) * L.color) * L.intensity) * L.attenuate;
    return diffuse;
}

static inline __attribute__((always_inline))
void DoLight(thread const SurfaceParams& S, thread const LightParams& L, thread float3& Fd, thread const float3& Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        Fd += (Diffuse_Low(param, param_1) * coatAttenuate);
    }
}

static inline __attribute__((always_inline))
float3 Lighting(thread const SurfaceParams& S, thread const LightGroupParams& LG)
{
    float3 Fd = float3(0.0);
    float3 Fr = float3(0.0);
    float3 finalRGB = float3(0.0);
    SurfaceParams param = S;
    LightParams param_1 = LG.DirLights[0];
    float3 param_2 = Fd;
    float3 param_3 = Fr;
    DoLight(param, param_1, param_2, param_3);
    Fd = param_2;
    Fr = param_3;
    SurfaceParams param_4 = S;
    LightParams param_5 = LG.DirLights[1];
    float3 param_6 = Fd;
    float3 param_7 = Fr;
    DoLight(param_4, param_5, param_6, param_7);
    Fd = param_6;
    Fr = param_7;
    SurfaceParams param_8 = S;
    LightParams param_9 = LG.DirLights[2];
    float3 param_10 = Fd;
    float3 param_11 = Fr;
    DoLight(param_8, param_9, param_10, param_11);
    Fd = param_10;
    Fr = param_11;
    SurfaceParams param_12 = S;
    LightParams param_13 = LG.PointLights[0];
    float3 param_14 = Fd;
    float3 param_15 = Fr;
    DoLight(param_12, param_13, param_14, param_15);
    Fd = param_14;
    Fr = param_15;
    SurfaceParams param_16 = S;
    LightParams param_17 = LG.PointLights[1];
    float3 param_18 = Fd;
    float3 param_19 = Fr;
    DoLight(param_16, param_17, param_18, param_19);
    Fd = param_18;
    Fr = param_19;
    SurfaceParams param_20 = S;
    LightParams param_21 = LG.PointLights[2];
    float3 param_22 = Fd;
    float3 param_23 = Fr;
    DoLight(param_20, param_21, param_22, param_23);
    Fd = param_22;
    Fr = param_23;
    SurfaceParams param_24 = S;
    LightParams param_25 = LG.PointLights[3];
    float3 param_26 = Fd;
    float3 param_27 = Fr;
    DoLight(param_24, param_25, param_26, param_27);
    Fd = param_26;
    Fr = param_27;
    SurfaceParams param_28 = S;
    LightParams param_29 = LG.PointLights[4];
    float3 param_30 = Fd;
    float3 param_31 = Fr;
    DoLight(param_28, param_29, param_30, param_31);
    Fd = param_30;
    Fr = param_31;
    SurfaceParams param_32 = S;
    LightParams param_33 = LG.PointLights[5];
    float3 param_34 = Fd;
    float3 param_35 = Fr;
    DoLight(param_32, param_33, param_34, param_35);
    Fd = param_34;
    Fr = param_35;
    SurfaceParams param_36 = S;
    LightParams param_37 = LG.PointLights[6];
    float3 param_38 = Fd;
    float3 param_39 = Fr;
    DoLight(param_36, param_37, param_38, param_39);
    Fd = param_38;
    Fr = param_39;
    SurfaceParams param_40 = S;
    LightParams param_41 = LG.PointLights[7];
    float3 param_42 = Fd;
    float3 param_43 = Fr;
    DoLight(param_40, param_41, param_42, param_43);
    Fd = param_42;
    Fr = param_43;
    SurfaceParams param_44 = S;
    LightParams param_45 = LG.SpotLights[0];
    float3 param_46 = Fd;
    float3 param_47 = Fr;
    DoLight(param_44, param_45, param_46, param_47);
    Fd = param_46;
    Fr = param_47;
    SurfaceParams param_48 = S;
    LightParams param_49 = LG.SpotLights[1];
    float3 param_50 = Fd;
    float3 param_51 = Fr;
    DoLight(param_48, param_49, param_50, param_51);
    Fd = param_50;
    Fr = param_51;
    SurfaceParams param_52 = S;
    LightParams param_53 = LG.SpotLights[2];
    float3 param_54 = Fd;
    float3 param_55 = Fr;
    DoLight(param_52, param_53, param_54, param_55);
    Fd = param_54;
    Fr = param_55;
    SurfaceParams param_56 = S;
    LightParams param_57 = LG.SpotLights[3];
    float3 param_58 = Fd;
    float3 param_59 = Fr;
    DoLight(param_56, param_57, param_58, param_59);
    Fd = param_58;
    Fr = param_59;
    SurfaceParams param_60 = S;
    LightParams param_61 = LG.SpotLights[4];
    float3 param_62 = Fd;
    float3 param_63 = Fr;
    DoLight(param_60, param_61, param_62, param_63);
    Fd = param_62;
    Fr = param_63;
    SurfaceParams param_64 = S;
    LightParams param_65 = LG.SpotLights[5];
    float3 param_66 = Fd;
    float3 param_67 = Fr;
    DoLight(param_64, param_65, param_66, param_67);
    Fd = param_66;
    Fr = param_67;
    SurfaceParams param_68 = S;
    LightParams param_69 = LG.SpotLights[6];
    float3 param_70 = Fd;
    float3 param_71 = Fr;
    DoLight(param_68, param_69, param_70, param_71);
    Fd = param_70;
    Fr = param_71;
    SurfaceParams param_72 = S;
    LightParams param_73 = LG.SpotLights[7];
    float3 param_74 = Fd;
    float3 param_75 = Fr;
    DoLight(param_72, param_73, param_74, param_75);
    Fd = param_74;
    Fr = param_75;
    finalRGB = Fd + Fr;
    return finalRGB;
}

static inline __attribute__((always_inline))
float4 MainEntry(thread const float3& albedo, thread const float3& nDir, thread const float3& pos, thread const float3& emissiv, constant float4x4& u_DirLight0ShadowMatrix, constant float4& u_DirLight0ShadowColor, constant float& u_DirLight0ShadowBias, constant float2& u_DirLight0ShadowTextureSize, constant float& u_DirLight0ShadowSoft, texture2d<float> u_DirLight0ShadowTexture, sampler u_DirLight0ShadowTextureSmplr, constant float& u_DirLight0ShadowSoftness, constant float& u_DirLight0SelfShadowGradient, constant float& u_DirLight0ShadowStrength, constant float4x4& u_SpotLight0ShadowMatrix, constant float& u_SpotLight0ShadowBias, constant float& u_SpotLight0ShadowSoftness, constant float2& u_SpotLight0ShadowTextureSize, constant float4& u_SpotLight0ShadowColor, constant float& u_SpotLight0ShadowSoft, texture2d<float> u_SpotLight0ShadowTexture, sampler u_SpotLight0ShadowTextureSmplr, constant float& u_SpotLight0ShadowStrength, constant spvUnsafeArray<float4, 8>& u_PointLightsPosition, constant float& u_PointLight0ShadowBias, constant float2& u_PointLight0ShadowBoundingBoxSize, constant float& u_PointLight0ShadowSoftness, constant float2& u_PointLight0ShadowTextureSize, texturecube<float> u_PointLight0ShadowTexture, sampler u_PointLight0ShadowTextureSmplr, constant float& u_PointLight0ShadowSoft, constant float4& u_PointLight0ShadowColor, constant spvUnsafeArray<float, 3>& u_DirLightsEnabled, constant float& u_DirLightNum, constant spvUnsafeArray<float4, 3>& u_DirLightsDirection, constant spvUnsafeArray<float4, 3>& u_DirLightsColor, constant spvUnsafeArray<float, 3>& u_DirLightsIntensity, constant spvUnsafeArray<float, 8>& u_PointLightsEnabled, constant float& u_PointLightNum, constant spvUnsafeArray<float4, 8>& u_PointLightsColor, constant spvUnsafeArray<float, 8>& u_PointLightsIntensity, constant spvUnsafeArray<float, 8>& u_PointLightsAttenRangeInv, constant spvUnsafeArray<float, 8>& u_SpotLightsEnabled, constant float& u_SpotLightNum, constant spvUnsafeArray<float4, 8>& u_SpotLightsPosition, constant spvUnsafeArray<float4, 8>& u_SpotLightsColor, constant spvUnsafeArray<float, 8>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 8>& u_SpotLightsAttenRangeInv, constant spvUnsafeArray<float4, 8>& u_SpotLightsDirection, constant spvUnsafeArray<float, 8>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 8>& u_SpotLightsInnerAngleCos)
{
    float3 param = albedo;
    float3 param_1 = nDir;
    float3 param_2 = pos;
    float3 param_3 = emissiv;
    SurfaceParams S = BuildSurfaceParams(param, param_1, param_2, param_3);
    SurfaceParams param_4 = S;
    LightGroupParams LG = BuildLightGroupParams(param_4, u_DirLight0ShadowMatrix, u_DirLight0ShadowColor, u_DirLight0ShadowBias, u_DirLight0ShadowTextureSize, u_DirLight0ShadowSoft, u_DirLight0ShadowTexture, u_DirLight0ShadowTextureSmplr, u_DirLight0ShadowSoftness, u_DirLight0SelfShadowGradient, u_DirLight0ShadowStrength, u_SpotLight0ShadowMatrix, u_SpotLight0ShadowBias, u_SpotLight0ShadowSoftness, u_SpotLight0ShadowTextureSize, u_SpotLight0ShadowColor, u_SpotLight0ShadowSoft, u_SpotLight0ShadowTexture, u_SpotLight0ShadowTextureSmplr, u_SpotLight0ShadowStrength, u_PointLightsPosition, u_PointLight0ShadowBias, u_PointLight0ShadowBoundingBoxSize, u_PointLight0ShadowSoftness, u_PointLight0ShadowTextureSize, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr, u_PointLight0ShadowSoft, u_PointLight0ShadowColor, u_DirLightsEnabled, u_DirLightNum, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity, u_PointLightsEnabled, u_PointLightNum, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv, u_SpotLightsEnabled, u_SpotLightNum, u_SpotLightsPosition, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsAttenRangeInv, u_SpotLightsDirection, u_SpotLightsOuterAngleCos, u_SpotLightsInnerAngleCos);
    SurfaceParams param_5 = S;
    LightGroupParams param_6 = LG;
    float3 finalRGB = Lighting(param_5, param_6);
    float4 result = float4(finalRGB, 1.0);
    return result;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_DirLight0ShadowTexture [[texture(0)]], texture2d<float> u_SpotLight0ShadowTexture [[texture(1)]], texturecube<float> u_PointLight0ShadowTexture [[texture(2)]], sampler u_DirLight0ShadowTextureSmplr [[sampler(0)]], sampler u_SpotLight0ShadowTextureSmplr [[sampler(1)]], sampler u_PointLight0ShadowTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float2 uv = in.v_uv0;
    float3 normal = in.v_nDirWS;
    float3 color = buffer._AlbedoColor.xyz;
    float3 ambient = (buffer._AmbientColor.xyz * color) * buffer._AmbientIntensity;
    float3 emissive = float3(0.0);
    float4 result = float4(ambient, 1.0);
    float3 param = color;
    float3 param_1 = normal;
    float3 param_2 = in.v_posWS;
    float3 param_3 = emissive;
    float3 _1646 = result.xyz + MainEntry(param, param_1, param_2, param_3, buffer.u_DirLight0ShadowMatrix, buffer.u_DirLight0ShadowColor, buffer.u_DirLight0ShadowBias, buffer.u_DirLight0ShadowTextureSize, buffer.u_DirLight0ShadowSoft, u_DirLight0ShadowTexture, u_DirLight0ShadowTextureSmplr, buffer.u_DirLight0ShadowSoftness, buffer.u_DirLight0SelfShadowGradient, buffer.u_DirLight0ShadowStrength, buffer.u_SpotLight0ShadowMatrix, buffer.u_SpotLight0ShadowBias, buffer.u_SpotLight0ShadowSoftness, buffer.u_SpotLight0ShadowTextureSize, buffer.u_SpotLight0ShadowColor, buffer.u_SpotLight0ShadowSoft, u_SpotLight0ShadowTexture, u_SpotLight0ShadowTextureSmplr, buffer.u_SpotLight0ShadowStrength, buffer.u_PointLightsPosition, buffer.u_PointLight0ShadowBias, buffer.u_PointLight0ShadowBoundingBoxSize, buffer.u_PointLight0ShadowSoftness, buffer.u_PointLight0ShadowTextureSize, u_PointLight0ShadowTexture, u_PointLight0ShadowTextureSmplr, buffer.u_PointLight0ShadowSoft, buffer.u_PointLight0ShadowColor, buffer.u_DirLightsEnabled, buffer.u_DirLightNum, buffer.u_DirLightsDirection, buffer.u_DirLightsColor, buffer.u_DirLightsIntensity, buffer.u_PointLightsEnabled, buffer.u_PointLightNum, buffer.u_PointLightsColor, buffer.u_PointLightsIntensity, buffer.u_PointLightsAttenRangeInv, buffer.u_SpotLightsEnabled, buffer.u_SpotLightNum, buffer.u_SpotLightsPosition, buffer.u_SpotLightsColor, buffer.u_SpotLightsIntensity, buffer.u_SpotLightsAttenRangeInv, buffer.u_SpotLightsDirection, buffer.u_SpotLightsOuterAngleCos, buffer.u_SpotLightsInnerAngleCos).xyz;
    result = float4(_1646.x, _1646.y, _1646.z, result.w);
    out.o_fragColor = result;
    return out;
}

