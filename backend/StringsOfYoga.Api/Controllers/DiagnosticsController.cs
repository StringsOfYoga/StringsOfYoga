using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using StringsOfYoga.Api.Data;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase
{
    private static readonly string[] ProbeUrls =
    {
        "https://www.google.com/generate_204",
        "https://cloud.mongodb.com/",
        "https://www.mongodb.com/"
    };

    private readonly MongoDbContext _db;

    public DiagnosticsController(MongoDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var build = Assembly.GetExecutingAssembly()
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;

        var probes = new List<object>();
        foreach (var url in ProbeUrls)
        {
            probes.Add(await ProbeAsync(url));
        }

        string mongo;
        try
        {
            await _db.Workshops.Database.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
            mongo = "ok";
        }
        catch (Exception ex)
        {
            mongo = $"fail: {Flatten(ex)}";
        }

        return Ok(new
        {
            success = true,
            build,
            timestamp = DateTime.UtcNow,
            mongo,
            probes
        });
    }

    private async Task<object> ProbeAsync(string url)
    {
        try
        {
            using var handler = new SocketsHttpHandler
            {
                ConnectTimeout = TimeSpan.FromSeconds(10)
            };
            using var client = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(12) };
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
            using var response = await client.GetAsync(url, cts.Token);
            return new { url, ok = true, status = (int)response.StatusCode };
        }
        catch (Exception ex)
        {
            return new { url, ok = false, error = Flatten(ex) };
        }
    }

    private static string Flatten(Exception exception)
    {
        var parts = new List<string>();
        for (var ex = exception; ex != null; ex = ex.InnerException)
        {
            parts.Add($"[{ex.GetType().Name}] {ex.Message}");
        }

        return string.Join(" ---> ", parts);
    }
}