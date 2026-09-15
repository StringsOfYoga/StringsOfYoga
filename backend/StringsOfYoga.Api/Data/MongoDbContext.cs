using System.Security.Authentication;
using MongoDB.Driver;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Data;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(string? connectionString, string databaseName)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            _database = FallbackClient().GetDatabase(databaseName);
            return;
        }

        try
        {
            var settings = MongoClientSettings.FromConnectionString(connectionString);
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            settings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12 };
            settings.ConnectTimeout = TimeSpan.FromSeconds(10);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(15);
            settings.HeartbeatTimeout = TimeSpan.FromSeconds(10);
            _database = new MongoClient(settings).GetDatabase(databaseName);
        }
        catch (Exception)
        {
            _database = FallbackClient().GetDatabase(databaseName);
        }
    }

    private static MongoClient FallbackClient() =>
        new(MongoClientSettings.FromConnectionString("mongodb://127.0.0.1:27017"));

    public IMongoCollection<Workshop> Workshops => _database.GetCollection<Workshop>("workshops");
    public IMongoCollection<Resource> Resources => _database.GetCollection<Resource>("resources");
    public IMongoCollection<GalleryMedia> Media => _database.GetCollection<GalleryMedia>("media");
    public IMongoCollection<GalleryCollection> Collections => _database.GetCollection<GalleryCollection>("collections");
    public IMongoCollection<ContactMessage> ContactMessages => _database.GetCollection<ContactMessage>("contactmessages");

    public async Task EnsureIndexesAsync()
    {
        var workshopKeys = Builders<Workshop>.IndexKeys.Ascending(w => w.Featured);
        await Workshops.Indexes.CreateOneAsync(new CreateIndexModel<Workshop>(workshopKeys));

        var resourceKeys = Builders<Resource>.IndexKeys.Ascending(r => r.Featured);
        await Resources.Indexes.CreateOneAsync(new CreateIndexModel<Resource>(resourceKeys));
    }
}