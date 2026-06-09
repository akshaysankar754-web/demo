using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var key = Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_12345");
var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
var claims = new[] {
    new Claim(ClaimTypes.NameIdentifier, "1"),
    new Claim(ClaimTypes.Email, "admin@local"),
    new Claim(ClaimTypes.Role, "Admin")
};
var token = new JwtSecurityToken(
    issuer: "InternshipPortal",
    audience: "InternshipPortalUsers",
    claims: claims,
    expires: DateTime.UtcNow.AddHours(1),
    signingCredentials: creds
);
var jwt = new JwtSecurityTokenHandler().WriteToken(token);

using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt);
var payload = new {
    title = "Test material",
    description = "Desc",
    fileUrl = "https://example.com",
    internshipId = 1
};
var request = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
var response = await client.PostAsync("http://localhost:5193/api/Material", request);
Console.WriteLine(response.StatusCode);
Console.WriteLine(await response.Content.ReadAsStringAsync());
