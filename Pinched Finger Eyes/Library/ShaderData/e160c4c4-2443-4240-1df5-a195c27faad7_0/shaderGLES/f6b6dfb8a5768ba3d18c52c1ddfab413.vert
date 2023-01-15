#version 300 es

uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_MVP;

out vec3 v_posWS;
layout(location = 0) in vec3 attPosition;
out vec3 v_nDirWS;
layout(location = 2) in vec3 attNormal;
out vec2 v_uv0;
layout(location = 1) in vec2 attTexcoord0;

void main()
{
    v_posWS = (u_Model * vec4(attPosition, 1.0)).xyz;
    v_nDirWS = (u_TransposeInvModel * vec4(attNormal, 0.0)).xyz;
    gl_Position = u_MVP * vec4(attPosition, 1.0);
    v_uv0 = vec2(attTexcoord0.x, 1.0 - attTexcoord0.y);
}

