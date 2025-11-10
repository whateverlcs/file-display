using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var frontendUrlReact = builder.Configuration["Frontend:UrlReact"];
var frontendUrlAngular = builder.Configuration["Frontend:UrlAngular"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins( //caminhos permitidos, no qual podem ser locais ou IPs
            "http://localhost:3000",
            "http://localhost:4200",
            frontendUrlReact!,
            frontendUrlAngular!)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors();

//Caminhos para acessar as pastas de arquivos, esse é o caminho fixo 1 (Veja o Controller para mais informações)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@""),
    RequestPath = "" //como o caminho fixo 1 é D:\ então o request path é /arquivos/d
});

//Caminhos para acessar as pastas de arquivos, esse é o caminho fixo 2 (Veja o Controller para mais informações)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@""),
    RequestPath = "" //como o caminho fixo 1 é E:\ então o request path é /arquivos/e
});

app.MapControllers();

app.Run();
