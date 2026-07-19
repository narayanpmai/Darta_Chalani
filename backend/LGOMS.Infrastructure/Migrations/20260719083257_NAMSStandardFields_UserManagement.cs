using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LGOMS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NAMSStandardFields_UserManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReferenceLetterNumber",
                table: "Chalanis",
                newName: "ReferenceDartaNumber");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmployeeCode",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            // Activate all pre-existing users (migration from old schema without IsActive)
            migrationBuilder.Sql("UPDATE \"Users\" SET \"IsActive\" = true WHERE \"IsActive\" = false;");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HandledBy",
                table: "Dartas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LetterType",
                table: "Dartas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderAddress",
                table: "Dartas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LetterNumber",
                table: "Chalanis",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmployeeCode",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "HandledBy",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "LetterType",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "SenderAddress",
                table: "Dartas");

            migrationBuilder.DropColumn(
                name: "LetterNumber",
                table: "Chalanis");

            migrationBuilder.RenameColumn(
                name: "ReferenceDartaNumber",
                table: "Chalanis",
                newName: "ReferenceLetterNumber");
        }
    }
}
