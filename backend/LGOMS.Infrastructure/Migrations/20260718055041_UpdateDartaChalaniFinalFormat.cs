using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LGOMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDartaChalaniFinalFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EntryTime",
                table: "Dartas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DispatchTime",
                table: "Chalanis",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrderOrDecision",
                table: "Chalanis",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PeonBookNumber",
                table: "Chalanis",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntryTime",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "DispatchTime",
                table: "Chalanis");

            migrationBuilder.DropColumn(
                name: "OrderOrDecision",
                table: "Chalanis");

            migrationBuilder.DropColumn(
                name: "PeonBookNumber",
                table: "Chalanis");
        }
    }
}
