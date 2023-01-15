#version 300 es
precision highp float;
precision highp int;

struct SurfaceParams
{
    vec3 albedo;
    vec3 nDir;
    vec3 pos;
    vec3 emissive;
};

struct LightParams
{
    float enable;
    vec3 lDir;
    vec3 color;
    float intensity;
    vec3 attenuate;
};

struct SoftShadowParams
{
    vec3 shadowUV;
    vec2 offsetUV;
    float depth;
    float positiveExp;
    float negativeExp;
    float mipmapLevel;
    float bias;
    float softness;
    vec2 _textureSize;
};

struct LightGroupParams
{
    LightParams DirLights[3];
    LightParams PointLights[8];
    LightParams SpotLights[8];
    float dummy;
};

const vec3 _868[20] = vec3[](vec3(1.0), vec3(1.0, -1.0, 1.0), vec3(-1.0, -1.0, 1.0), vec3(-1.0, 1.0, 1.0), vec3(1.0, 1.0, -1.0), vec3(1.0, -1.0, -1.0), vec3(-1.0), vec3(-1.0, 1.0, -1.0), vec3(1.0, 1.0, 0.0), vec3(1.0, -1.0, 0.0), vec3(-1.0, -1.0, 0.0), vec3(-1.0, 1.0, 0.0), vec3(1.0, 0.0, 1.0), vec3(-1.0, 0.0, 1.0), vec3(1.0, 0.0, -1.0), vec3(-1.0, 0.0, -1.0), vec3(0.0, 1.0, 1.0), vec3(0.0, -1.0, 1.0), vec3(0.0, -1.0, -1.0), vec3(0.0, 1.0, -1.0));

uniform mat4 u_DirLight0ShadowMatrix;
uniform vec4 u_DirLight0ShadowColor;
uniform float u_DirLight0ShadowBias;
uniform vec2 u_DirLight0ShadowTextureSize;
uniform float u_DirLight0ShadowSoft;
uniform mediump sampler2D u_DirLight0ShadowTexture;
uniform float u_DirLight0ShadowSoftness;
uniform float u_DirLight0SelfShadowGradient;
uniform float u_DirLight0ShadowStrength;
uniform mat4 u_SpotLight0ShadowMatrix;
uniform float u_SpotLight0ShadowBias;
uniform float u_SpotLight0ShadowSoftness;
uniform vec2 u_SpotLight0ShadowTextureSize;
uniform vec4 u_SpotLight0ShadowColor;
uniform float u_SpotLight0ShadowSoft;
uniform mediump sampler2D u_SpotLight0ShadowTexture;
uniform float u_SpotLight0ShadowStrength;
uniform vec4 u_PointLightsPosition[8];
uniform float u_PointLight0ShadowBias;
uniform vec2 u_PointLight0ShadowBoundingBoxSize;
uniform float u_PointLight0ShadowSoftness;
uniform vec2 u_PointLight0ShadowTextureSize;
uniform mediump samplerCube u_PointLight0ShadowTexture;
uniform float u_PointLight0ShadowSoft;
uniform vec4 u_PointLight0ShadowColor;
uniform float u_DirLightsEnabled[3];
uniform float u_DirLightNum;
uniform vec4 u_DirLightsDirection[3];
uniform vec4 u_DirLightsColor[3];
uniform float u_DirLightsIntensity[3];
uniform float u_PointLightsEnabled[8];
uniform float u_PointLightNum;
uniform vec4 u_PointLightsColor[8];
uniform float u_PointLightsIntensity[8];
uniform float u_PointLightsAttenRangeInv[8];
uniform float u_SpotLightsEnabled[8];
uniform float u_SpotLightNum;
uniform vec4 u_SpotLightsPosition[8];
uniform vec4 u_SpotLightsColor[8];
uniform float u_SpotLightsIntensity[8];
uniform float u_SpotLightsAttenRangeInv[8];
uniform vec4 u_SpotLightsDirection[8];
uniform float u_SpotLightsOuterAngleCos[8];
uniform float u_SpotLightsInnerAngleCos[8];
uniform vec4 _AlbedoColor;
uniform vec4 _AmbientColor;
uniform float _AmbientIntensity;
uniform vec4 u_WorldSpaceCameraPos;
uniform vec2 u_DirLight0ShadowBoundingBoxSize;
uniform float u_SpotLight0ShadowBlurSize;
uniform float u_SpotLight0SelfShadowGradient;
uniform float u_PointLight0ShadowStrength;
uniform float u_PointLight0ShadowBlurSize;
uniform float u_PointLight0SelfShadowGradient;

in vec2 v_uv0;
in vec3 v_nDirWS;
in vec3 v_posWS;
layout(location = 0) out vec4 o_fragColor;

SurfaceParams BuildSurfaceParams(vec3 albedo, vec3 nDir, vec3 pos, vec3 emissive)
{
    SurfaceParams S;
    S.albedo = albedo;
    S.nDir = nDir;
    S.pos = pos;
    S.emissive = emissive;
    return S;
}

LightParams BuildDirLightParams(SurfaceParams S, mediump int index)
{
    LightParams ML;
    ML.enable = u_DirLightsEnabled[index] * step(float(index) + 0.5, u_DirLightNum);
    ML.lDir = normalize(-u_DirLightsDirection[index].xyz);
    ML.color = u_DirLightsColor[index].xyz;
    ML.intensity = u_DirLightsIntensity[index] * ML.enable;
    ML.attenuate = vec3(1.0);
    return ML;
}

float rand(vec2 co)
{
    return fract(sin(dot(co, vec2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

float DecodeFloat(vec4 value)
{
    return dot(value, vec4(1.52587890625e-05, 0.00390625, 1.0, 0.0));
}

vec4 Shadowing(SurfaceParams S, LightParams L)
{
    float nl = max(dot(S.nDir, L.lDir), 0.0);
    vec4 proj_pos = u_DirLight0ShadowMatrix * vec4(S.pos, 1.0);
    vec3 shadow_coord = proj_pos.xyz / vec3(proj_pos.w);
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
        return vec4(u_DirLight0ShadowColor.xyz, 1.0);
    }
    shadow_coord.z = clamp(shadow_coord.z, 0.0, 1.0);
    float bias = u_DirLight0ShadowBias + clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    bias = clamp(bias, 0.0, 1.0);
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    float shadow_alpha = 0.0;
    vec2 inv_tex_size = vec2(1.0) / u_DirLight0ShadowTextureSize;
    float inv_num = 0.0625;
    if (u_DirLight0ShadowSoft > 0.0)
    {
        for (mediump int i = 0; i < 4; i++)
        {
            float float_i = float(i);
            for (mediump int j = 0; j < 4; j++)
            {
                float float_j = float(j);
                vec2 param = shadow_coord.xy + vec2(float_i, float_j);
                float jitter_x = rand(param);
                vec2 param_1 = shadow_coord.xy + vec2(float_i * 2.0, float_j * 3.0);
                float jitter_y = rand(param_1);
                float r = sqrt(float_i + jitter_x);
                float theta = (6.28318023681640625 * (float(j) + jitter_y)) * inv_num;
                vec4 data = texture(u_DirLight0ShadowTexture, shadow_coord.xy + ((vec2(r * cos(theta), r * sin(theta)) * u_DirLight0ShadowSoftness) * inv_tex_size));
                float depth = DecodeFloat(data);
                float noShadow = float(shadow_coord.z <= (depth + bias));
                shadow_sum += noShadow;
                shadow_alpha += max(data.w, noShadow);
            }
        }
        shadow_factor = shadow_sum / 16.0;
        shadow_alpha /= 16.0;
    }
    else
    {
        vec4 data_1 = texture(u_DirLight0ShadowTexture, shadow_coord.xy);
        float depth_1 = DecodeFloat(data_1);
        float noShadow_1 = float(shadow_coord.z <= (depth_1 + bias));
        shadow_factor = noShadow_1;
        shadow_alpha = max(data_1.w, noShadow_1);
    }
    if (u_DirLight0SelfShadowGradient > 9.9999997473787516355514526367188e-05)
    {
        shadow_factor = min(clamp((nl - 0.00872653536498546600341796875) * u_DirLight0SelfShadowGradient, 0.0, 1.0), shadow_factor);
    }
    if (shadow_factor < 1.0)
    {
        shadow_factor = mix(1.0, shadow_factor, u_DirLight0ShadowStrength * shadow_alpha);
    }
    return vec4(u_DirLight0ShadowColor.xyz, shadow_factor);
}

float Pow4(float x)
{
    float x2 = x * x;
    return x2 * x2;
}

float saturate(float x)
{
    return clamp(x, 0.0, 1.0);
}

float Pow2(float x)
{
    return x * x;
}

LightParams BuildPointLightParams(SurfaceParams S, mediump int index)
{
    vec3 lVec = vec3(0.0);
    float lDist = 0.0;
    LightParams PL1;
    PL1.enable = u_PointLightsEnabled[index] * step(float(index) + 0.5, u_PointLightNum);
    lVec = u_PointLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    PL1.lDir = lVec / vec3(lDist);
    PL1.color = u_PointLightsColor[index].xyz;
    PL1.intensity = u_PointLightsIntensity[index] * PL1.enable;
    float lWorldDist = lDist;
    lDist *= u_PointLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lWorldDist;
    float param_4 = 0.00999999977648258209228515625;
    float attenuate = Pow2(param_2) / max(Pow2(param_3), Pow2(param_4));
    PL1.attenuate = vec3(attenuate, attenuate, attenuate);
    return PL1;
}

SoftShadowParams GetPointSoftShadowParams(SurfaceParams S, LightParams L)
{
    vec3 fragToLight = S.pos - u_PointLightsPosition[0].xyz;
    vec3 coord = normalize(S.pos - u_PointLightsPosition[0].xyz);
    float nl = max(dot(S.nDir, L.lDir), 0.0);
    SoftShadowParams SS;
    SS.bias = u_PointLight0ShadowBias + clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    SS.bias = clamp(SS.bias, 0.0, 1.0);
    SS.shadowUV = coord;
    SS.offsetUV = vec2(0.0);
    SS.depth = clamp(length(fragToLight) * u_PointLight0ShadowBoundingBoxSize.y, 0.0, 1.0) - SS.bias;
    SS.softness = u_PointLight0ShadowSoftness;
    SS._textureSize = u_PointLight0ShadowTextureSize;
    return SS;
}

float PointSampleShadowMapUV(vec3 shadowUV, float depth)
{
    vec4 arg = texture(u_PointLight0ShadowTexture, shadowUV);
    float depthInShadowMap = DecodeFloat(arg);
    return step(depth, depthInShadowMap);
}

float PointSampleShadowMapPoisson9(vec2 size, vec3 uv, float depth, float softness)
{
    float result = 0.0;
    float uvStep = (((1.0 / size.x) * softness) * size.x) * 0.00999999977648258209228515625;
    for (mediump int i = 0; i < 20; i++)
    {
        vec3 param = uv + (_868[i] * uvStep);
        float param_1 = depth;
        result += PointSampleShadowMapUV(param, param_1);
    }
    return result * 0.0500000007450580596923828125;
}

float PointStaticPoissonPCF(SurfaceParams S, LightParams L, SoftShadowParams SS)
{
    float softness = SS.softness;
    vec2 param = SS._textureSize;
    vec3 param_1 = SS.shadowUV;
    float param_2 = SS.depth;
    float param_3 = softness;
    return PointSampleShadowMapPoisson9(param, param_1, param_2, param_3);
}

vec4 PointShadowing(SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    SoftShadowParams SS = GetPointSoftShadowParams(param, param_1);
    float nl = max(dot(S.nDir, L.lDir), 0.0);
    float shadowVal = 1.0;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    if (u_PointLight0ShadowSoft > 0.0)
    {
        SurfaceParams param_2 = S;
        LightParams param_3 = L;
        SoftShadowParams param_4 = SS;
        shadow_factor = PointStaticPoissonPCF(param_2, param_3, param_4);
    }
    else
    {
        vec4 data = texture(u_PointLight0ShadowTexture, SS.shadowUV);
        float depth = DecodeFloat(data);
        float noShadow = float(SS.depth <= depth);
        shadow_factor = noShadow;
    }
    return vec4(u_PointLight0ShadowColor.xyz, shadow_factor);
}

LightParams BuildSpotLightParams(SurfaceParams S, mediump int index)
{
    vec3 lVec = vec3(0.0);
    float lDist = 0.0;
    vec3 spotDir = vec3(0.0);
    float angleAtten = 0.0;
    LightParams SL1;
    SL1.enable = u_SpotLightsEnabled[index] * step(float(index) + 0.5, u_SpotLightNum);
    lVec = u_SpotLightsPosition[index].xyz - S.pos;
    lDist = length(lVec);
    SL1.lDir = lVec / vec3(lDist);
    SL1.color = u_SpotLightsColor[index].xyz;
    SL1.intensity = u_SpotLightsIntensity[index] * SL1.enable;
    float lWorldDist = lDist;
    lDist *= u_SpotLightsAttenRangeInv[index];
    float param = lDist;
    float param_1 = 1.0 - Pow4(param);
    float param_2 = saturate(param_1);
    float param_3 = lWorldDist;
    float param_4 = 0.00999999977648258209228515625;
    float attenuate = Pow2(param_2) / max(Pow2(param_3), Pow2(param_4));
    spotDir = normalize(-u_SpotLightsDirection[index].xyz);
    angleAtten = max(0.0, dot(SL1.lDir, spotDir));
    attenuate *= smoothstep(u_SpotLightsOuterAngleCos[index], u_SpotLightsInnerAngleCos[index], angleAtten);
    SL1.attenuate = vec3(attenuate, attenuate, attenuate);
    return SL1;
}

SoftShadowParams GetSpotSoftShadowParams(SurfaceParams S, LightParams L)
{
    vec4 posSS = u_SpotLight0ShadowMatrix * vec4(S.pos, 1.0);
    vec3 _583 = posSS.xyz / vec3(posSS.w);
    posSS = vec4(_583.x, _583.y, _583.z, posSS.w);
    vec3 _591 = (posSS.xyz * 0.5) + vec3(0.5);
    posSS = vec4(_591.x, _591.y, _591.z, posSS.w);
    float nl = max(dot(S.nDir, L.lDir), 0.0);
    SoftShadowParams SS;
    SS.bias = u_SpotLight0ShadowBias + clamp(tan(acos(nl)) / 1000.0, 0.0, 0.001000000047497451305389404296875);
    SS.bias = clamp(SS.bias, 0.0, 1.0);
    SS.shadowUV = vec3(posSS.xy.x, posSS.xy.y, SS.shadowUV.z);
    SS.offsetUV = vec2(0.0);
    SS.depth = clamp(posSS.z, 0.0, 1.0) - SS.bias;
    SS.softness = u_SpotLight0ShadowSoftness;
    SS._textureSize = u_SpotLight0ShadowTextureSize;
    return SS;
}

float StaticPoissonPCF(vec2 size, vec2 uv, float depth, float softness, mediump sampler2D shadowmap)
{
    float result = 0.0;
    float inv_num = 0.0625;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    float shadow_alpha = 0.0;
    for (mediump int i = 0; i < 4; i++)
    {
        float float_i = float(i);
        for (mediump int j = 0; j < 4; j++)
        {
            float float_j = float(j);
            vec2 param = uv + vec2(float_i, float_j);
            float jitter_x = rand(param);
            vec2 param_1 = uv + vec2(float_i * 2.0, float_j * 3.0);
            float jitter_y = rand(param_1);
            float r = sqrt(float_i + jitter_x);
            float theta = (6.28318023681640625 * (float(j) + jitter_y)) * inv_num;
            vec2 sampleUV = uv + ((vec2(r * cos(theta), r * sin(theta)) * softness) / size);
            vec4 data = texture(shadowmap, sampleUV);
            float decodeDepth = DecodeFloat(data);
            float noShadow = float(depth <= decodeDepth);
            shadow_sum += noShadow;
            shadow_alpha += max(data.w, noShadow);
        }
    }
    shadow_factor = shadow_sum / 16.0;
    shadow_alpha /= 16.0;
    return shadow_factor;
}

vec4 SpotShadowing(SurfaceParams S, LightParams L)
{
    SurfaceParams param = S;
    LightParams param_1 = L;
    SoftShadowParams SS = GetSpotSoftShadowParams(param, param_1);
    float nl = max(dot(S.nDir, L.lDir), 0.0);
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
        return vec4(u_SpotLight0ShadowColor.xyz, 1.0);
    }
    float shadowVal = 1.0;
    float shadow_factor = 0.0;
    float shadow_sum = 0.0;
    if (u_SpotLight0ShadowSoft > 0.0)
    {
        vec2 param_2 = SS._textureSize;
        vec2 param_3 = SS.shadowUV.xy;
        float param_4 = SS.depth;
        float param_5 = SS.softness;
        shadow_factor = StaticPoissonPCF(param_2, param_3, param_4, param_5, u_SpotLight0ShadowTexture);
    }
    else
    {
        vec4 data = texture(u_SpotLight0ShadowTexture, SS.shadowUV.xy);
        float depth = DecodeFloat(data);
        float noShadow = float(SS.depth <= depth);
        shadow_factor = noShadow;
    }
    if (shadow_factor < 1.0)
    {
        shadow_factor = mix(1.0, shadow_factor, u_SpotLight0ShadowStrength);
    }
    return vec4(u_SpotLight0ShadowColor.xyz, shadow_factor);
}

LightGroupParams BuildLightGroupParams(SurfaceParams S)
{
    LightGroupParams LG;
    LG.dummy = 0.0;
    SurfaceParams param = S;
    mediump int param_1 = 0;
    LG.DirLights[0] = BuildDirLightParams(param, param_1);
    if (LG.DirLights[0].enable > 0.5)
    {
        SurfaceParams param_2 = S;
        LightParams param_3 = LG.DirLights[0];
        vec4 shadowFactor = Shadowing(param_2, param_3);
        LG.DirLights[0].attenuate = mix(shadowFactor.xyz, LG.DirLights[0].attenuate, vec3(shadowFactor.w));
    }
    SurfaceParams param_4 = S;
    mediump int param_5 = 1;
    LG.DirLights[1] = BuildDirLightParams(param_4, param_5);
    SurfaceParams param_6 = S;
    mediump int param_7 = 2;
    LG.DirLights[2] = BuildDirLightParams(param_6, param_7);
    SurfaceParams param_8 = S;
    mediump int param_9 = 0;
    LG.PointLights[0] = BuildPointLightParams(param_8, param_9);
    if (LG.PointLights[0].enable > 0.5)
    {
        SurfaceParams param_10 = S;
        LightParams param_11 = LG.PointLights[0];
        vec4 pointShadowFactor = PointShadowing(param_10, param_11);
        LG.PointLights[0].attenuate = mix(pointShadowFactor.xyz, LG.PointLights[0].attenuate, vec3(pointShadowFactor.w));
    }
    SurfaceParams param_12 = S;
    mediump int param_13 = 1;
    LG.PointLights[1] = BuildPointLightParams(param_12, param_13);
    SurfaceParams param_14 = S;
    mediump int param_15 = 2;
    LG.PointLights[2] = BuildPointLightParams(param_14, param_15);
    SurfaceParams param_16 = S;
    mediump int param_17 = 0;
    LG.SpotLights[0] = BuildSpotLightParams(param_16, param_17);
    if (LG.SpotLights[0].enable > 0.5)
    {
        SurfaceParams param_18 = S;
        LightParams param_19 = LG.SpotLights[0];
        vec4 spotShadowFactor = SpotShadowing(param_18, param_19);
        LG.SpotLights[0].attenuate = mix(spotShadowFactor.xyz, LG.SpotLights[0].attenuate, vec3(spotShadowFactor.w));
    }
    SurfaceParams param_20 = S;
    mediump int param_21 = 1;
    LG.SpotLights[1] = BuildSpotLightParams(param_20, param_21);
    SurfaceParams param_22 = S;
    mediump int param_23 = 2;
    LG.SpotLights[2] = BuildSpotLightParams(param_22, param_23);
    return LG;
}

vec3 Diffuse_Low(SurfaceParams S, LightParams L)
{
    vec3 lightDir = L.lDir;
    float diff = max(dot(lightDir, S.nDir), 0.0);
    vec3 diffuse = (((S.albedo * diff) * L.color) * L.intensity) * L.attenuate;
    return diffuse;
}

void DoLight(SurfaceParams S, LightParams L, inout vec3 Fd, vec3 Fr)
{
    if (L.enable > 0.5)
    {
        float coatAttenuate = 1.0;
        SurfaceParams param = S;
        LightParams param_1 = L;
        Fd += (Diffuse_Low(param, param_1) * coatAttenuate);
    }
}

vec3 Lighting(SurfaceParams S, LightGroupParams LG)
{
    vec3 Fd = vec3(0.0);
    vec3 Fr = vec3(0.0);
    vec3 finalRGB = vec3(0.0);
    SurfaceParams param = S;
    LightParams param_1 = LG.DirLights[0];
    vec3 param_2 = Fd;
    vec3 param_3 = Fr;
    DoLight(param, param_1, param_2, param_3);
    Fd = param_2;
    Fr = param_3;
    SurfaceParams param_4 = S;
    LightParams param_5 = LG.DirLights[1];
    vec3 param_6 = Fd;
    vec3 param_7 = Fr;
    DoLight(param_4, param_5, param_6, param_7);
    Fd = param_6;
    Fr = param_7;
    SurfaceParams param_8 = S;
    LightParams param_9 = LG.DirLights[2];
    vec3 param_10 = Fd;
    vec3 param_11 = Fr;
    DoLight(param_8, param_9, param_10, param_11);
    Fd = param_10;
    Fr = param_11;
    SurfaceParams param_12 = S;
    LightParams param_13 = LG.PointLights[0];
    vec3 param_14 = Fd;
    vec3 param_15 = Fr;
    DoLight(param_12, param_13, param_14, param_15);
    Fd = param_14;
    Fr = param_15;
    SurfaceParams param_16 = S;
    LightParams param_17 = LG.PointLights[1];
    vec3 param_18 = Fd;
    vec3 param_19 = Fr;
    DoLight(param_16, param_17, param_18, param_19);
    Fd = param_18;
    Fr = param_19;
    SurfaceParams param_20 = S;
    LightParams param_21 = LG.PointLights[2];
    vec3 param_22 = Fd;
    vec3 param_23 = Fr;
    DoLight(param_20, param_21, param_22, param_23);
    Fd = param_22;
    Fr = param_23;
    SurfaceParams param_24 = S;
    LightParams param_25 = LG.PointLights[3];
    vec3 param_26 = Fd;
    vec3 param_27 = Fr;
    DoLight(param_24, param_25, param_26, param_27);
    Fd = param_26;
    Fr = param_27;
    SurfaceParams param_28 = S;
    LightParams param_29 = LG.PointLights[4];
    vec3 param_30 = Fd;
    vec3 param_31 = Fr;
    DoLight(param_28, param_29, param_30, param_31);
    Fd = param_30;
    Fr = param_31;
    SurfaceParams param_32 = S;
    LightParams param_33 = LG.PointLights[5];
    vec3 param_34 = Fd;
    vec3 param_35 = Fr;
    DoLight(param_32, param_33, param_34, param_35);
    Fd = param_34;
    Fr = param_35;
    SurfaceParams param_36 = S;
    LightParams param_37 = LG.PointLights[6];
    vec3 param_38 = Fd;
    vec3 param_39 = Fr;
    DoLight(param_36, param_37, param_38, param_39);
    Fd = param_38;
    Fr = param_39;
    SurfaceParams param_40 = S;
    LightParams param_41 = LG.PointLights[7];
    vec3 param_42 = Fd;
    vec3 param_43 = Fr;
    DoLight(param_40, param_41, param_42, param_43);
    Fd = param_42;
    Fr = param_43;
    SurfaceParams param_44 = S;
    LightParams param_45 = LG.SpotLights[0];
    vec3 param_46 = Fd;
    vec3 param_47 = Fr;
    DoLight(param_44, param_45, param_46, param_47);
    Fd = param_46;
    Fr = param_47;
    SurfaceParams param_48 = S;
    LightParams param_49 = LG.SpotLights[1];
    vec3 param_50 = Fd;
    vec3 param_51 = Fr;
    DoLight(param_48, param_49, param_50, param_51);
    Fd = param_50;
    Fr = param_51;
    SurfaceParams param_52 = S;
    LightParams param_53 = LG.SpotLights[2];
    vec3 param_54 = Fd;
    vec3 param_55 = Fr;
    DoLight(param_52, param_53, param_54, param_55);
    Fd = param_54;
    Fr = param_55;
    SurfaceParams param_56 = S;
    LightParams param_57 = LG.SpotLights[3];
    vec3 param_58 = Fd;
    vec3 param_59 = Fr;
    DoLight(param_56, param_57, param_58, param_59);
    Fd = param_58;
    Fr = param_59;
    SurfaceParams param_60 = S;
    LightParams param_61 = LG.SpotLights[4];
    vec3 param_62 = Fd;
    vec3 param_63 = Fr;
    DoLight(param_60, param_61, param_62, param_63);
    Fd = param_62;
    Fr = param_63;
    SurfaceParams param_64 = S;
    LightParams param_65 = LG.SpotLights[5];
    vec3 param_66 = Fd;
    vec3 param_67 = Fr;
    DoLight(param_64, param_65, param_66, param_67);
    Fd = param_66;
    Fr = param_67;
    SurfaceParams param_68 = S;
    LightParams param_69 = LG.SpotLights[6];
    vec3 param_70 = Fd;
    vec3 param_71 = Fr;
    DoLight(param_68, param_69, param_70, param_71);
    Fd = param_70;
    Fr = param_71;
    SurfaceParams param_72 = S;
    LightParams param_73 = LG.SpotLights[7];
    vec3 param_74 = Fd;
    vec3 param_75 = Fr;
    DoLight(param_72, param_73, param_74, param_75);
    Fd = param_74;
    Fr = param_75;
    finalRGB = Fd + Fr;
    return finalRGB;
}

vec4 MainEntry(vec3 albedo, vec3 nDir, vec3 pos, vec3 emissiv)
{
    vec3 param = albedo;
    vec3 param_1 = nDir;
    vec3 param_2 = pos;
    vec3 param_3 = emissiv;
    SurfaceParams S = BuildSurfaceParams(param, param_1, param_2, param_3);
    SurfaceParams param_4 = S;
    LightGroupParams LG = BuildLightGroupParams(param_4);
    SurfaceParams param_5 = S;
    LightGroupParams param_6 = LG;
    vec3 finalRGB = Lighting(param_5, param_6);
    vec4 result = vec4(finalRGB, 1.0);
    return result;
}

void main()
{
    vec2 uv = v_uv0;
    vec3 normal = v_nDirWS;
    vec3 color = _AlbedoColor.xyz;
    vec3 ambient = (_AmbientColor.xyz * color) * _AmbientIntensity;
    vec3 emissive = vec3(0.0);
    vec4 result = vec4(ambient, 1.0);
    vec3 param = color;
    vec3 param_1 = normal;
    vec3 param_2 = v_posWS;
    vec3 param_3 = emissive;
    vec3 _1646 = result.xyz + MainEntry(param, param_1, param_2, param_3).xyz;
    result = vec4(_1646.x, _1646.y, _1646.z, result.w);
    o_fragColor = result;
}

