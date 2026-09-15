using Microsoft.AspNetCore.Diagnostics;

namespace StringsOfYoga.Api.Middlewares;

public class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

        if (httpContext.Response.HasStarted)
        {
            return false;
        }

        var messages = new List<string>();
        for (var ex = exception; ex != null; ex = ex.InnerException)
        {
            messages.Add($"[{ex.GetType().Name}] {ex.Message}");
        }

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/json";
        await httpContext.Response.WriteAsJsonAsync(new
        {
            success = false,
            status = 500,
            message = string.Join(" ---> ", messages),
            exceptionType = exception.GetType().Name,
            stackTrace = exception.StackTrace
        }, cancellationToken);

        return true;
    }
}