namespace StringsOfYoga.Api.Dtos;

/// <summary>
/// Consistent API envelope matching the Angular `extractData` helper:
/// when <c>success</c> is true and <c>data</c> is present, the client unwraps <c>data</c>.
/// </summary>
public class ApiResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;

    public static ApiResponse Ok(string message = "") =>
        new() { Success = true, Message = message };

    public static ApiResponse<T> Ok<T>(T data, string message = "") =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse Error(string message) =>
        new() { Success = false, Message = message };
}

public class ApiResponse<T> : ApiResponse
{
    public T? Data { get; set; }
}

public class AuthLoginRequest
{
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}

public class ContactRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
}