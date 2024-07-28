using Calendar.App.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Calendar.App.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimeSlotController : ControllerBase
    {
        private readonly ILogger<TimeSlotController> _logger;

        public TimeSlotController(ILogger<TimeSlotController> logger)
        {
            _logger = logger;
        }

        [HttpGet("InitialTimeSlots")]
        public IEnumerable<string> GetInitialBoookedTimeSlots()
        {
            return TimeSlot.InitialBookedSlotTimes;
        }        
    }
}
