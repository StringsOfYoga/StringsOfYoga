using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.RegularExpressions;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly MongoDbContext _db;

    public MediaController(MongoDbContext db) => _db = db;

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<List<GalleryMedia>>>> GetFeatured()
    {
        var filter = Builders<GalleryMedia>.Filter.Eq(m => m.IsFeatured, true);
        var list = await _db.Media.Find(filter).ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("collection/{id}")]
    public async Task<ActionResult<ApiResponse<List<GalleryMedia>>>> GetByCollection(string id)
    {
        var filter = Builders<GalleryMedia>.Filter.Eq(m => m.CollectionId, id);
        var list = await _db.Media.Find(filter).ToListAsync();
        return Ok(ApiResponse.Ok(list));
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<List<GalleryMedia>>>> Search([FromQuery] string q = "")
    {
        List<GalleryMedia> list;
        if (string.IsNullOrWhiteSpace(q))
        {
            list = await _db.Media.Find(_ => true).ToListAsync();
        }
        else
        {
            var pattern = new BsonRegularExpression(Regex.Escape(q), "i");
            var filter = Builders<GalleryMedia>.Filter.Or(
                Builders<GalleryMedia>.Filter.Regex(m => m.Title, pattern),
                Builders<GalleryMedia>.Filter.Regex(m => m.Description, pattern),
                Builders<GalleryMedia>.Filter.Regex(m => m.Category, pattern)
            );
            list = await _db.Media.Find(filter).ToListAsync();
        }
        return Ok(ApiResponse.Ok(list));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<GalleryMedia>>> Create([FromBody] GalleryMedia media)
    {
        media.Id = ObjectId.GenerateNewId().ToString();
        await _db.Media.InsertOneAsync(media);
        return Ok(ApiResponse.Ok(media));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse>> Delete(string id)
    {
        var result = await _db.Media.DeleteOneAsync(m => m.Id == id);
        if (result.DeletedCount == 0) return NotFound(ApiResponse.Error("Media not found."));
        return Ok(ApiResponse.Ok("Media deleted."));
    }

    [HttpPost("signature")]
    public ActionResult<ApiResponse<object>> GetUploadSignature([FromBody] SignatureRequest request)
    {
        return Ok(ApiResponse.Ok(new { api_key = "placeholder", timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), signature = "unsigned" }));
    }
}

public class SignatureRequest
{
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
}