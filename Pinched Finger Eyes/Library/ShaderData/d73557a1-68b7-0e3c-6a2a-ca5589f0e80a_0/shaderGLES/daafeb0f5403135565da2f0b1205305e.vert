#version 300 es

uniform mat4 u_Palatte[50];
uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_MVP;

layout(location = 3) in vec4 attBoneIds;
layout(location = 4) in vec4 attWeights;
layout(location = 0) in vec3 attPosition;
layout(location = 2) in vec3 attNormal;
out vec3 v_posWS;
out vec3 v_nDirWS;
out vec2 v_uv0;
layout(location = 1) in vec2 attTexcoord0;

void main()
{
    mat4 _30 = u_Palatte[int(attBoneIds.x)] * attWeights.x;
    mat4 _39 = u_Palatte[int(attBoneIds.y)] * attWeights.y;
    mat4 _52 = mat4(_30[0] + _39[0], _30[1] + _39[1], _30[2] + _39[2], _30[3] + _39[3]);
    mat4 _61 = u_Palatte[int(attBoneIds.z)] * attWeights.z;
    mat4 _74 = mat4(_52[0] + _61[0], _52[1] + _61[1], _52[2] + _61[2], _52[3] + _61[3]);
    mat4 _83 = u_Palatte[int(attBoneIds.w)] * attWeights.w;
    mat4 boneTransform = mat4(_74[0] + _83[0], _74[1] + _83[1], _74[2] + _83[2], _74[3] + _83[3]);
    vec4 bm_postiton = boneTransform * vec4(attPosition, 1.0);
    vec3 bn_normal = (boneTransform * vec4(attNormal, 0.0)).xyz;
    v_posWS = (u_Model * bm_postiton).xyz;
    v_nDirWS = (u_TransposeInvModel * vec4(bn_normal, 0.0)).xyz;
    gl_Position = u_MVP * bm_postiton;
    v_uv0 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
}

