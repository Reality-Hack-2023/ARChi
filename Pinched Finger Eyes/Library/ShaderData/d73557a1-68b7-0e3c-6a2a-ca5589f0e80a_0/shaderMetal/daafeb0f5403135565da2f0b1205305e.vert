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
    spvUnsafeArray<float4x4, 50> u_Palatte;
    float4x4 u_Model;
    float4x4 u_TransposeInvModel;
    float4x4 u_MVP;
};

struct main0_out
{
    float2 v_uv0;
    float3 v_nDirWS;
    float3 v_posWS;
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 attPosition [[attribute(0)]];
    float2 attTexcoord0 [[attribute(1)]];
    float3 attNormal [[attribute(2)]];
    float4 attBoneIds [[attribute(3)]];
    float4 attWeights [[attribute(4)]];
};

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float4x4 _30 = buffer.u_Palatte[int(in.attBoneIds.x)] * in.attWeights.x;
    float4x4 _39 = buffer.u_Palatte[int(in.attBoneIds.y)] * in.attWeights.y;
    float4x4 _52 = float4x4(_30[0] + _39[0], _30[1] + _39[1], _30[2] + _39[2], _30[3] + _39[3]);
    float4x4 _61 = buffer.u_Palatte[int(in.attBoneIds.z)] * in.attWeights.z;
    float4x4 _74 = float4x4(_52[0] + _61[0], _52[1] + _61[1], _52[2] + _61[2], _52[3] + _61[3]);
    float4x4 _83 = buffer.u_Palatte[int(in.attBoneIds.w)] * in.attWeights.w;
    float4x4 boneTransform = float4x4(_74[0] + _83[0], _74[1] + _83[1], _74[2] + _83[2], _74[3] + _83[3]);
    float4 bm_postiton = boneTransform * float4(in.attPosition, 1.0);
    float3 bn_normal = (boneTransform * float4(in.attNormal, 0.0)).xyz;
    out.v_posWS = (buffer.u_Model * bm_postiton).xyz;
    out.v_nDirWS = (buffer.u_TransposeInvModel * float4(bn_normal, 0.0)).xyz;
    out.gl_Position = buffer.u_MVP * bm_postiton;
    out.v_uv0 = float2(in.attTexcoord0.x, 1.0 - in.attTexcoord0.y);
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

