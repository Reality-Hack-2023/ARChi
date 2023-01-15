#version 300 es

uniform mat4 u_Model;
uniform mat4 u_TransposeInvModel;
uniform mat4 u_MVP;

layout(location = 0) in vec3 attPosition;
out vec3 g_worldPos;
out vec3 g_worldNormal;
layout(location = 2) in vec3 attNormal;
layout(location = 1) in vec2 attTexcoord0;

void main()
{
    vec3 modelPostiton = attPosition;
    vec4 homogeneous_pos = vec4(attPosition, 1.0);
    g_worldPos = (u_Model * homogeneous_pos).xyz;
    g_worldNormal = normalize((u_TransposeInvModel * vec4(attNormal, 0.0)).xyz);
    gl_Position = u_MVP * homogeneous_pos;
}

