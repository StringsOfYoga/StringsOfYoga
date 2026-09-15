# Strings of Yoga API

ASP.NET Core (.NET 10) Web API that backs the Strings of Yoga Angular app, using **MongoDB Atlas**.

## API Explorer (Swagger)

Open the **Swagger UI** in a browser to see every endpoint, try them live, and read request/response shapes:

- Local: `http://localhost:5000/swagger`
- Deployed: `https://<your-api-host>/swagger`

Swagger / OpenAPI is **always enabled** so endpoints remain visible after deployment.
The raw OpenAPI spec is at `https://<your-api-host>/swagger/v1/swagger.json`.

## Endpoints

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | Liveness + MongoDB ping (200 ok / 503 unavailable) + `build` stamp |
| GET | `/api/diagnostics` | – | Build stamp + outbound TLS probes (google/cloud.mongodb/mongodb.com) + Mongo status |
| POST | `/api/auth/login` | – | Admin login, returns JWT |
| GET | `/api/workshops` | – | All workshops |
| GET | `/api/workshops/featured` | – | Featured workshops |
| GET | `/api/workshops/{id}` | – | Single workshop |
| POST | `/api/workshops` | JWT | Create workshop |
| PUT | `/api/workshops/{id}` | JWT | Update workshop |
| DELETE | `/api/workshops/{id}` | JWT | Delete workshop |
| GET | `/api/resources` | – | All resources |
| GET | `/api/resources/{id}` | – | Single resource |
| POST | `/api/resources` | JWT | Create resource |
| PUT | `/api/resources/{id}` | JWT | Update resource |
| PATCH | `/api/resources/{id}` | JWT | Partial update (featured toggle) |
| DELETE | `/api/resources/{id}` | JWT | Delete resource |
| GET | `/api/media/featured` | – | Featured media |
| GET | `/api/media/collection/{id}` | – | Media by collection |
| GET | `/api/media/search?q=` | – | Search media |
| POST | `/api/media` | JWT | Create media |
| DELETE | `/api/media/{id}` | JWT | Delete media |
| POST | `/api/media/signature` | – | Upload signature |
| GET | `/api/collections` | – | All collections |
| GET | `/api/collections/featured` | – | Featured collections |
| POST | `/api/collections` | JWT | Create collection |
| DELETE | `/api/collections/{id}` | JWT | Delete collection |
| POST | `/api/contact` | – | Submit contact message |

Responses use the envelope `{ "success": true, "data": ... }`, which the Angular `extractData` helper unwraps automatically.

## Run locally

```bash
dotnet run
```

Server: `http://localhost:5000` · Swagger UI: `http://localhost:5000/swagger`

## Configuration (`appsettings.json`)

Override any value with environment variables in the shape `MongoDb__ConnectionString`, `Jwt__Secret`, `Admin__Password`, etc.

```jsonc
{
  "MongoDb": {
    "ConnectionString": "mongodb+srv://...",
    "DatabaseName": "stringsofyoga"
  },
  "Jwt": {
    "Secret": "...",          // keep secret in production
    "Issuer": "StringsOfYoga",
    "Audience": "StringsOfYoga",
    "ExpiresInMinutes": 1440
  },
  "Admin": {
    "Password": "..."         // password accepted by /api/auth/login
  },
  "Cors": {
    "AllowedOrigins": [ "http://localhost:4200" ]
  }
}
```

The database is seeded automatically on first run (workshops, media, collections) when a collection is empty.

## Startup resilience

The API **always starts**, even if MongoDB is unreachable or misconfigured. Seeding/index creation failures are logged instead of crashing the process, so a bad `MongoDb__ConnectionString` never produces an IIS `500.30` again. Check `/api/health` for MongoDB status and the console/log output for the `[config]` warnings.

## Error responses

Any unhandled exception is returned in the response body (instead of a bare 500), so you can see the real cause from Swagger or the browser:

```json
{ "success": false, "status": 500, "message": "[TimeoutException] ...",
  "exceptionType": "TimeoutException", "stackTrace": "..." }
```

## Publish / Deploy

```bash
# Framework-dependent (server needs the .NET 10 runtime)
dotnet publish -c Release -o publish

# Self-contained Windows (server needs NOTHING installed)
dotnet publish -c Release -r win-x64 --self-contained true -o publish-selfcontained
```

Note: the build enables `InvariantGlobalization` + `PredefinedCulturesOnly` (already in
`StringsOfYoga.Api.runtimeconfig.json`) — this matches MonsterASP's working sample hosting
requirements and avoids ICU/NLS startup failures (IIS 500.30) on servers without full
globalization data.

Deploy the contents of the chosen folder to your host (Azure App Service, IIS, Docker, etc.). The `publish/` and `publish-selfcontained/` folders include `web.config` for IIS/Azure App Service on Windows.

**Important:** when running the `.exe` directly, Kestrel only listens on `localhost` by default. To allow external/API traffic, set the environment variable on the server:

```
ASPNETCORE_URLS=http://0.0.0.0:5000
```

(or bind the port you want). For IIS/Azure App Service the host sets the port automatically.

### Connect the Angular app

Set the API URL in `src/environments/environment.prod.ts`:

```ts
apiUrl: 'https://<your-api-host>/api'
```

## Security note

The MongoDB connection string currently contains live credentials in `appsettings.json`. Move it to an environment variable / Azure Key Vault / App Service setting before production and rotate the password if the file is ever shared.