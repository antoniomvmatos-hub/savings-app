using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Savings.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Snapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    TechEtf = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TechEtfInv = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Sp500 = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Sp500Inv = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SafetyFund = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CheckingAccount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Snapshots", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Snapshots");
        }
    }
}
