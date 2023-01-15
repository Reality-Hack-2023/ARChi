#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4x4 u_Model;
    float4x4 u_TransposeInvModel;
    float4x4 u_MVP;
};

struct main0_out
{
    float3 g_worldPos;
    float3 g_worldNormal;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 attPosition [[attribute(0)]];
    float3 attNormal [[attribute(2)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float3 modelPostiton = in.attPosition;
    float4 homogeneous_pos = float4(in.attPosition, 1.0);
    out.g_worldPos = (buffer.u_Model * homogeneous_pos).xyz;
    out.g_worldNormal = normalize((buffer.u_TransposeInvModel * float4(in.attNormal, 0.0)).xyz);
    out.gl_Position = buffer.u_MVP * homogeneous_pos;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

