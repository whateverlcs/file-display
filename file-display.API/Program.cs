using filedisplay.API.Models;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FileStorageConfig>(
    builder.Configuration.GetSection("FileStorage"));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var frontendUrlReact = builder.Configuration["Frontend:UrlReact"];
var frontendUrlAngular = builder.Configuration["Frontend:UrlAngular"];
var localfrontendUrlReact = builder.Configuration["Frontend:LocalhostReact"];
var localfrontendUrlAngular = builder.Configuration["Frontend:LocalhostAngular"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            localfrontendUrlReact!,
            localfrontendUrlAngular!,
            frontendUrlReact!,
            frontendUrlAngular!)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();

var config = app.Services.GetRequiredService<Microsoft.Extensions.Options.IOptions<FileStorageConfig>>().Value;

foreach (var rootPath in config.RootPaths)
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(rootPath.PhysicalPath),
        RequestPath = rootPath.UrlPrefix
    });
}

app.MapControllers();

app.Run();
