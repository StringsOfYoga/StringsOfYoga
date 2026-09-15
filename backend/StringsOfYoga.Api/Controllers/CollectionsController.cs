using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CollectionsController : ControllerBase
{
    private readonly MongoDbContext _db;

    public CollectionsController(MongoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<GalleryCollection>>>> GetAll()
    {
        var list = await _db.Collections.Find(_ => true).ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<GalleryCollection>>>> GetFeatured()
    {
        var filter = Builders<GalleryCollection>.Filter.Eq(c => c.IsFeatured, true);
        var list = await _db.Collections.Find(filter).ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<GalleryCollection>>> Create([FromBody] GalleryCollection collection)
    {
        collection.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        await _db.Collections.InsertOneAsync(collection);
        return Ok(ApiResponse.Ok(collection));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(string id)
    {
        var result = await _db.Collections.DeleteOneAsync(c => c.Id == id);
        if (result.DeletedCount == 0) return NotFound(ApiResponse.Error("Collection not found."));
        return Ok(ApiResponse.Ok("Collection deleted."));
    }
}