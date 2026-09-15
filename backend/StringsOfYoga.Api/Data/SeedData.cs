using MongoDB.Bson;
using MongoDB.Driver;
using StringsOfYoga.Api.Models;

namespace StringsOfYoga.Api.Data;

public static class SeedData
{
    public static async Task SeedAsync(MongoDbContext db)
    {
        await SeedWorkshops(db);
        await SeedMedia(db);
        await SeedCollections(db);
    }

    private static async Task SeedWorkshops(MongoDbContext db)
    {
        var count = await db.Workshops.CountDocumentsAsync(_ => true);
        if (count > 0) return;

        var workshops = new List<Workshop>
        {
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Women's Well-Being Workshop",
                Description = "A monthly face-to-face workshop supporting women's physical, mental, and emotional wellbeing. Topics may include hormonal balance, menopause support, bone health and strength, breathwork, Yoga Nidra, mindfulness, and self-care practices.",
                Date = "2026-10-10",
                Time = "10:00 AM",
                Location = "Face-to-face · Studio",
                CoverImage = "download4.jpg",
                CtaText = "Reserve Spot",
                Featured = true,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Title = "Pregnancy Yoga Workshop",
                Description = "A gentle and supportive practice designed to help women navigate pregnancy through movement, breath awareness, relaxation, and preparation for birth. Suitable from 12 weeks of pregnancy onwards—please consult your healthcare professional.",
                Date = "2026-10-17",
                Time = "11:00 AM",
                Location = "Face-to-face · Studio",
                CoverImage = "download5.jpg",
                CtaText = "Reserve Spot",
                Featured = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        await db.Workshops.InsertManyAsync(workshops);
    }

    private static async Task SeedMedia(MongoDbContext db)
    {
        var count = await db.Media.CountDocumentsAsync(_ => true);
        if (count > 0) return;

        var media = new List<GalleryMedia>
        {
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "Guided Yoga Nidra", Type = "audio", Url = "/assets/audio/yoga-nidra.mp3", ThumbnailUrl = "download4.jpg", CollectionId = "sleep-better", Description = "A 25-minute guided Yoga Nidra practice for deep rest.", IsFeatured = true, Category = "Yoga Nidra" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "Guided Yoga Nidra for Sleep", Type = "video", Url = "https://www.youtube.com/watch?v=VFJwKU-o5dE", ThumbnailUrl = "download2.jpg", CollectionId = "sleep-better", IsFeatured = true, Category = "Yoga Nidra" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "30-Minute Yoga Nidra", Type = "video", Url = "https://www.youtube.com/watch?v=inpok4MKVLM", ThumbnailUrl = "download3.jpg", CollectionId = "sleep-better", IsFeatured = true, Category = "Yoga Nidra" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "Morning Breath Awareness", Type = "audio", Url = "/assets/audio/yoga-nidra.mp3", ThumbnailUrl = "download1.jpg", CollectionId = "beginner-breathwork", IsFeatured = false, Category = "Breathing Practices" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "Grounding & Self-Care Guide", Type = "pdf", Url = "/assets/STRINGS OF YOGA planning-.pdf", ThumbnailUrl = "download5.jpg", CollectionId = "self-care-guides", Description = "Practical self-care exercises for everyday wellbeing.", IsFeatured = false, Category = "Self-care" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Title = "Yoga Nidra — Deep Rest", Type = "image", Url = "download1.jpg", ThumbnailUrl = "download1.jpg", CollectionId = "morning-calm", IsFeatured = false, Category = "Meditation" }
        };

        await db.Media.InsertManyAsync(media);
    }

    private static async Task SeedCollections(MongoDbContext db)
    {
        var count = await db.Collections.CountDocumentsAsync(_ => true);
        if (count > 0) return;

        var collections = new List<GalleryCollection>
        {
            new() { Id = ObjectId.GenerateNewId().ToString(), Name = "Guided Yoga Nidra", Description = "Guided Yoga Nidra recordings to support deep rest and nervous system regulation.", IsFeatured = true, Image = "download4.jpg" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Name = "Breathing Practices", Description = "Gentle breathing practices to build awareness, reduce stress, and regulate the nervous system.", IsFeatured = true, Image = "download2.jpg" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Name = "Wellbeing Articles", Description = "Thoughtful reads on awareness, rest, and the everyday practice of yoga for wellbeing.", IsFeatured = true, Image = "download3.jpg" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Name = "Meditation Resources", Description = "Guided meditations and practices for concentration, relaxation, and personal transformation.", IsFeatured = true, Image = "download1.jpg" },
            new() { Id = ObjectId.GenerateNewId().ToString(), Name = "Self-Care Guides", Description = "Practical self-care resources to support health, balance, and inner wellbeing.", IsFeatured = true, Image = "download5.jpg" }
        };

        await db.Collections.InsertManyAsync(collections);
    }
}