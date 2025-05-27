using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iOmniEYE.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedUserId",
                table: "ClientRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "ClientRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CrmUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TelegramUsername = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TelegramId = table.Column<long>(type: "bigint", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CrmUsers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClientRequests_AssignedUserId",
                table: "ClientRequests",
                column: "AssignedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClientRequests_CrmUsers_AssignedUserId",
                table: "ClientRequests",
                column: "AssignedUserId",
                principalTable: "CrmUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClientRequests_CrmUsers_AssignedUserId",
                table: "ClientRequests");

            migrationBuilder.DropTable(
                name: "CrmUsers");

            migrationBuilder.DropIndex(
                name: "IX_ClientRequests_AssignedUserId",
                table: "ClientRequests");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "ClientRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "ClientRequests");
        }
    }
}
