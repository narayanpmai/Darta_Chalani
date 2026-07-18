using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LGOMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDartaChalaniFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReceivedLetterDate",
                table: "Dartas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceivedLetterNumber",
                table: "Dartas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Dartas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceLetterNumber",
                table: "Chalanis",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "Chalanis",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReceivedLetterDate",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "ReceivedLetterNumber",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "ReferenceLetterNumber",
                table: "Chalanis");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "Chalanis");
        }
    }
}
