using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StringsOfYoga.Api.Data;
using StringsOfYoga.Api.Middlewares;
using StringsOfYoga.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ── MongoDB ──────────────────────────────────────────────────────────────────
var mongoConn = builder.Configuration["MongoDb:ConnectionString"]!;
var mongoDbName = builder.Configuration["MongoDb:DatabaseName"] ?? "stringsofyoga";
if (string.IsNullOrWhiteSpace(mongoConn))
    Console.Error.WriteLine("[config] MongoDb:ConnectionString is MISSING or empty — set the MongoDb__ConnectionString environment variable or appsettings.json.");
if (string.IsNullOrWhiteSpace(builder.Configuration["Jwt:Secret"]))
    Console.Error.WriteLine("[config] Jwt:Secret is MISSING or empty — set the Jwt__Secret environment variable or appsettings.json.");
builder.Services.AddSingleton(new MongoDbContext(mongoConn, mongoDbName));

// ── Auth service ─────────────────────────────────────────────────────────────
builder.Services.AddSingleton<AuthService>();

// ── JWT Authentication ──────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync(
                    "{\"success\":false,\"message\":\"Unauthorized.\"}");
            },
            OnForbidden = context =>
            {
                context.Response.StatusCode = 403;
                context.Response.ContentType = "application/json";
                return context.Response.WriteAsync(
                    "{\"success\":false,\"message\":\"Forbidden.\"}");
            }
        };
    });

// ── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:4200" };
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── Controllers + Swagger ───────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Global exception handler — surfaces the real exception in the JSON response
builder.Services.AddExceptionHandler<ApiExceptionHandler>();
builder.Services.AddProblemDetails();

// ── Build ────────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Seed database (must never crash the app) ─────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await db.EnsureIndexesAsync();
        await SeedData.SeedAsync(db);
        logger.LogInformation("MongoDB reachable; indexes and seed data ensured.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex,
            "MongoDB is currently unreachable or misconfigured. The API still starts; " +
            "database-backed endpoints will fail until MongoDB can be reached. " +
            "Check the MongoDb__ConnectionString setting.");
    }
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.UseExceptionHandler();
// Swagger UI is available at /swagger on all environments.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Strings of Yoga API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

Console.WriteLine("🚀 Strings of Yoga API is running on http://localhost:5000");
Console.WriteLine("📖 Swagger UI: http://localhost:5000/swagger");

app.Run();