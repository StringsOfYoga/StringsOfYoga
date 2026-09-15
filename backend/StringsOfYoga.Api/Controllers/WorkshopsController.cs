using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkshopsController : ControllerBase
{
    private readonly MongoDbContext _db;

    public WorkshopsController(MongoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Workshop>>>> GetAll()
    {
        var list = await _db.Workshops.Find(_ => true)
            .SortBy(w => w.Date)
            .ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<Workshop>>>> GetFeatured()
    {
        var filter = Builders<Workshop>.Filter.Eq(w => w.Featured, true);
        var list = await _db.Workshops.Find(filter).SortBy(w => w.Date).ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<Workshop>>> GetById(string id)
    {
        var workshop = await _db.Workshops.Find(w => w.Id == id).FirstOrDefaultAsync();
        if (workshop == null) return NotFound(ApiResponse.Error("Workshop not found."));
        return Ok(ApiResponse.Ok(workshop));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<Workshop>>> Create([FromBody] Workshop workshop)
    {
        workshop.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        workshop.CreatedAt = DateTime.UtcNow;
        await _db.Workshops.InsertOneAsync(workshop);
        return Ok(ApiResponse.Ok(workshop));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<Workshop>>> Update(string id, [FromBody] Workshop update)
    {
        update.Id = id;
        var result = await _db.Workshops.ReplaceOneAsync(w => w.Id == id, update);
        if (result.MatchedCount == 0) return NotFound(ApiResponse.Error("Workshop not found."));
        return Ok(ApiResponse.Ok(update));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(string id)
    {
        var result = await _db.Workshops.DeleteOneAsync(w => w.Id == id);
        if (result.DeletedCount == 0) return NotFound(ApiResponse.Error("Workshop not found."));
        return Ok(ApiResponse.Ok("Workshop deleted."));
    }
}