using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StringsOfYoga.Api.Models;

public class GalleryMedia
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = "image";
    public string Url { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string CollectionId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public string Category { get; set; } = string.Empty;
}
