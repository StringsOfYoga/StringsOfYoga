using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using StringsOfYoga.Api.Data;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly MongoDbContext _db;

    public HealthController(MongoDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var build = Assembly.GetExecutingAssembly()
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;

        try
        {
            await _db.Workshops.Database.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1));
            return Ok(new { success = true, mongo = "ok", build });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { success = false, mongo = "unavailable", build, message = ex.Message });
        }
    }
}