using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StringsOfYoga.Api.Models;

public class GalleryCollection
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public string Image { get; set; } = string.Empty;
}
