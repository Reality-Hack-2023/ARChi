#version 300 es
precision highp float;
precision highp int;

uniform vec4 _AlbedoColor;
uniform mat4 u_VP;
uniform mediump sampler2D u_FBOTexture;

in vec2 g_vary_uv0;
in vec4 v_gl_pos;
layout(location = 0) out vec4 o_fragColor;
in vec3 v_posWS;

vec4 ApplyBlendMode(vec4 color, vec2 uv)
{
    vec4 ret = color;
    return ret;
}

void main()
{
    vec2 uv = g_vary_uv0;
    uv.y = 1.0 - uv.y;
    vec4 t_albedo = vec4(1.0);
    vec4 final_color = t_albedo * _AlbedoColor;
    vec2 ndc_coord = v_gl_pos.xy / vec2(v_gl_pos.w);
    vec2 screen_coord = (ndc_coord * 0.5) + vec2(0.5);
    vec4 param = final_color;
    vec2 param_1 = screen_coord;
    o_fragColor = ApplyBlendMode(param, param_1);
}

