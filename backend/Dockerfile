FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["LGOMS.Api/LGOMS.Api.csproj", "LGOMS.Api/"]
COPY ["LGOMS.Application/LGOMS.Application.csproj", "LGOMS.Application/"]
COPY ["LGOMS.Domain/LGOMS.Domain.csproj", "LGOMS.Domain/"]
COPY ["LGOMS.Infrastructure/LGOMS.Infrastructure.csproj", "LGOMS.Infrastructure/"]

RUN dotnet restore "LGOMS.Api/LGOMS.Api.csproj"
COPY . .
WORKDIR "/src/LGOMS.Api"
RUN dotnet publish "LGOMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "LGOMS.Api.dll"]
