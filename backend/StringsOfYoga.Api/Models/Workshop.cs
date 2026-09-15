using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StringsOfYoga.Api.Models;

public class Workshop
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public string CoverImagePublicId { get; set; } = string.Empty;
    public string CtaText { get; set; } = "Reserve Spot";
    public string CtaLink { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
