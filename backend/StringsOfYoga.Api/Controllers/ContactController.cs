using Microsoft.AspNetCore.Mvc;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Dtos;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly MongoDbContext _db;

    public ContactController(MongoDbContext db) => _db = db;

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> Submit([FromBody] ContactRequest request)
    {
        var message = new ContactMessage
        {
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject ?? string.Empty,
            Message = request.Message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _db.ContactMessages.InsertOneAsync(message);
        return Ok(ApiResponse.Ok("Message received."));
    }
}