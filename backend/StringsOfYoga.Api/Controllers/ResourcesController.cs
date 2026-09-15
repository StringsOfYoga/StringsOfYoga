using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly MongoDbContext _db;

    public ResourcesController(MongoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Resource>>>> GetAll()
    {
        var list = await _db.Resources.Find(_ => true)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Resource>>> GetById(string id)
    {
        var resource = await _db.Resources.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (resource == null) return NotFound(ApiResponse.Error("Resource not found."));
        return Ok(ApiResponse.Ok(resource));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Resource>>> Create([FromBody] Resource resource)
    {
        resource.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        resource.CreatedAt = DateTime.UtcNow;
        resource.UpdatedAt = DateTime.UtcNow;
        await _db.Resources.InsertOneAsync(resource);
        return Ok(ApiResponse.Ok(resource));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Resource>>> Update(string id, [FromBody] Resource update)
    {
        update.Id = id;
        update.UpdatedAt = DateTime.UtcNow;
        var result = await _db.Resources.ReplaceOneAsync(r => r.Id == id, update);
        if (result.MatchedCount == 0) return NotFound(ApiResponse.Error("Resource not found."));
        return Ok(ApiResponse.Ok(update));
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<ActionResult<ApiResponse<Resource>>> Patch(string id, [FromBody] Dictionary<string, object> updates)
    {
        var resource = await _db.Resources.Find(r => r.Id == id).FirstOrDefaultAsync();
        if (resource == null) return NotFound(ApiResponse.Error("Resource not found."));

        if (updates.ContainsKey("featured"))
            resource.Featured = Convert.ToBoolean(updates["featured"]);

        resource.UpdatedAt = DateTime.UtcNow;
        await _db.Resources.ReplaceOneAsync(r => r.Id == id, resource);
        return Ok(ApiResponse.Ok(resource));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(string id)
    {
        var result = await _db.Resources.DeleteOneAsync(r => r.Id == id);
        if (result.DeletedCount == 0) return NotFound(ApiResponse.Error("Resource not found."));
        return Ok(ApiResponse.Ok("Resource deleted."));
    }
}