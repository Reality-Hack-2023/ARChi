#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D _MainTex;
uniform mediump sampler2D _LutTexture;
uniform float _Intensity;

in vec2 uv0;
layout(location = 0) out vec4 o_FragColor;

void main()
{
    vec4 color = texture(_MainTex, uv0);
    float blueColor = color.z * 63.0;
    vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);
    vec2 texPos1;
    texPos1.x = ((quad1.x * 0.125) + 0.0009765625) + (0.123046875 * color.x);
    texPos1.y = ((quad1.y * 0.125) + 0.0009765625) + (0.123046875 * color.y);
    mediump vec4 newColor = texture(_LutTexture, texPos1);
    vec3 _85 = mix(color.xyz, newColor.xyz, vec3(_Intensity * color.w));
    color = vec4(_85.x, _85.y, _85.z, color.w);
    o_FragColor = color;
}

