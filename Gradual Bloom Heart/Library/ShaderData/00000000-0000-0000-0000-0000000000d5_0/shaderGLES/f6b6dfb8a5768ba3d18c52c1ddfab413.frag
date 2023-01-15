#version 300 es
precision highp float;
precision highp int;

uniform mediump sampler2D _MainTex;
uniform mediump float _Exposure;
uniform mediump float _Brightness;
uniform mediump float _Temperature;
uniform mediump float _Tint;
uniform mediump float _Contrast;
uniform mediump float _Saturation;

in vec2 uv0;
layout(location = 0) out vec4 o_FragColor;

mediump vec3 LinearToLMS(mediump vec3 x)
{
    return mat3(vec3(0.390404999256134033203125, 0.549941003322601318359375, 0.008926319889724254608154296875), vec3(0.070841602981090545654296875, 0.963172018527984619140625, 0.001357750035822391510009765625), vec3(0.02310819923877716064453125, 0.1280210018157958984375, 0.936245024204254150390625)) * x;
}

mediump float StandardIlluminantY(mediump float x)
{
    return ((2.86999988555908203125 * x) - ((3.0 * x) * x)) - 0.2750950753688812255859375;
}

mediump vec3 CIExyToLMS(mediump float x, mediump float y)
{
    mediump float Y = 1.0;
    mediump float X = (Y * x) / y;
    mediump float Z = (Y * ((1.0 - x) - y)) / y;
    mediump float L = ((0.732800006866455078125 * X) + (0.4296000003814697265625 * Y)) - (0.1624000072479248046875 * Z);
    mediump float M = (((-0.703599989414215087890625) * X) + (1.6974999904632568359375 * Y)) + (0.006099999882280826568603515625 * Z);
    mediump float S = ((0.0030000000260770320892333984375 * X) + (0.013600000180304050445556640625 * Y)) + (0.98339998722076416015625 * Z);
    return vec3(L, M, S);
}

mediump vec3 WhiteBalanceToLMSCoeffs(mediump float temperature, mediump float tint)
{
    mediump float t1 = temperature * 1.5384614467620849609375;
    mediump float t2 = tint * 1.5384614467620849609375;
    mediump float x = 0.312709987163543701171875 - (t1 * ((t1 < 0.0) ? 0.100000001490116119384765625 : 0.0500000007450580596923828125));
    mediump float param = x;
    mediump float y = StandardIlluminantY(param) + (t2 * 0.0500000007450580596923828125);
    mediump vec3 w1 = vec3(0.94923698902130126953125, 1.035419940948486328125, 1.0872800350189208984375);
    mediump float param_1 = x;
    mediump float param_2 = y;
    mediump vec3 w2 = CIExyToLMS(param_1, param_2);
    return vec3(w1.x / w2.x, w1.y / w2.y, w1.z / w2.z);
}

mediump vec3 LMSToLinear(mediump vec3 x)
{
    return mat3(vec3(2.85846996307373046875, -1.62879002094268798828125, -0.0248910002410411834716796875), vec3(-0.21018199622631072998046875, 1.1582000255584716796875, 0.0003242809907533228397369384765625), vec3(-0.0418119989335536956787109375, -0.118169002234935760498046875, 1.0686700344085693359375)) * x;
}

void main()
{
    mediump vec4 result = texture(_MainTex, uv0);
    mediump float alpha = result.w;
    mediump vec3 _222 = result.xyz * pow(2.0, _Exposure * alpha);
    result = vec4(_222.x, _222.y, _222.z, result.w);
    mediump vec3 _232 = result.xyz + vec3(_Brightness * alpha);
    result = vec4(_232.x, _232.y, _232.z, result.w);
    mediump vec3 param = result.xyz;
    mediump vec3 colorLMS = LinearToLMS(param);
    mediump float param_1 = _Temperature * alpha;
    mediump float param_2 = _Tint * alpha;
    colorLMS *= WhiteBalanceToLMSCoeffs(param_1, param_2);
    mediump vec3 param_3 = colorLMS;
    mediump vec3 _255 = LMSToLinear(param_3);
    result = vec4(_255.x, _255.y, _255.z, result.w);
    mediump float midpoint = 0.21763764321804046630859375;
    mediump vec3 _273 = ((result.xyz - vec3(midpoint)) * ((_Contrast * alpha) + 1.0)) + vec3(midpoint);
    result = vec4(_273.x, _273.y, _273.z, result.w);
    mediump vec3 grayscale = vec3(dot(result.xyz, vec3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875)));
    mediump vec3 _294 = mix(grayscale, result.xyz, vec3(1.0 + (_Saturation * alpha)));
    result = vec4(_294.x, _294.y, _294.z, result.w);
    o_FragColor = result;
}

