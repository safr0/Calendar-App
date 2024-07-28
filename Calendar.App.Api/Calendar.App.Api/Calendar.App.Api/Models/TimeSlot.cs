namespace Calendar.App.Api.Models
{
    public class TimeSlot
    {
        public static int BookingOpeningTime { get; } = 9;
        public static int BookingClosingTime { get; } = 17;
        public static int HourSplitAmount { get; } = 2;
        public static List<string> InitialBookedSlotTimes { get; } = new List<string> { "11:00", "12:00", "12:30", "15:30" };
    }
}
