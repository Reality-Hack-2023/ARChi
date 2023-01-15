#version 300 es
precision highp float;
precision highp int;

uniform vec4 u_DirLightsDirection[3];
uniform mat4 u_DirLight0ShadowMatrix;
uniform vec4 u_DirLight0ShadowColor;
uniform float u_DirLight0ShadowBias;
uniform vec2 u_DirLight0ShadowTextureSize;
uniform float u_DirLight0ShadowSoft;
uniform mediump sampler2D u_DirLight0ShadowTexture;
uniform float u_DirLight0ShadowSoftness;
uniform float u_DirLight0SelfShadowGradient;
uniform float u_DirLight0ShadowStrength;
uniform float u_DirLightsEnabled[3];
uniform float u_DirLightNum;
uniform vec4 u_DirLightsColor[3];
uniform float u_DirLightsIntensity[3];
uniform vec2 u_DirLight0ShadowBoundingBoxSize;

in vec3 g_worldNormal;
in vec3 g_worldPos;
layout(location = 0) out vec4 glResult;

float rand(vec2 co)
{
    return fract(sin(dot(co, vec2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

float DecodeFloat(vec4 value)
{
    return dot(value, vec4(1.52587890625e-05, 0.00390625, 1.0, 0.0));
}

vec4 Shadowing(vec3 worldPosition, vec3 worldNormal)
{
    float nl = max(dot(worldNormal, -u_DirLightsDirection[0].xyz), 0.0);
    vec4 proj_pos = u_DirLight0ShadowMatrix * vec4(worldPosition, 1.0);
    vec3 shadow_coord = proj_pos.xyz / vec3(proj_pos.w);
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

void main()
{
    vec3 worldNormal = normalize(g_worldNormal);
    vec4 shadowFactor = vec4(1.0);
    float alpha = 1.0;
    float enable = u_DirLightsEnabled[0] * step(0.5, u_DirLightNum);
    if (enable > 0.5)
    {
        vec3 param = g_worldPos;
        vec3 param_1 = worldNormal;
        shadowFactor = Shadowing(param, param_1);
        alpha = 1.0 - shadowFactor.w;
    }
    glResult = vec4(shadowFactor.xyz, alpha);
}

