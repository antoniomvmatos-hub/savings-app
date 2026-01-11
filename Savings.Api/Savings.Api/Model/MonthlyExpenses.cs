namespace Savings.Api.Models
{
    public class MonthlySnapshot
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TechEtf { get; set; }
        public decimal TechEtfInv { get; set; }
        public decimal Sp500 { get; set; }
        public decimal Sp500Inv { get; set; }
        public decimal SafetyFund { get; set; }
        public decimal CheckingAccount { get; set; }
    }
}
