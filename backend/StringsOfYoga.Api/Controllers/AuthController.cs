using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Services;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    public ActionResult<ApiResponse<LoginResponse>> Login([FromBody] AuthLoginRequest request)
    {
        if (!_auth.ValidatePassword(request.Password))
            return Unauthorized(ApiResponse.Error("Invalid password."));

        var response = _auth.CreateToken();
        return Ok(ApiResponse.Ok(response));
    }
}
