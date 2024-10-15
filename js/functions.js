function parseTime(timeString) {
  const [hour, minute] = timeString.split(':');
  return hour * 60 + Number(minute);
}

function chekMeeting(dayStart, dayEnd, meetingStart, meetingDuration) {
  const dayStartInMinutes = parseTime(dayStart);
  const dayEndInMinutes = parseTime(meetingStart);
  const meetingStartInMinutes = parseTime(meetingStart);

  return (
    meetingStartInMinutes >= dayStartInMinutes &&
    meetingStartInMinutes + meetingDuration <= dayEndInMinutes
  );
}


chekMeeting('08:00', '17:30', '14:00', 90);
chekMeeting('8:0', '10:0', '8:0', 120);
chekMeeting('08:00', '14:30', '14:00', 90);
chekMeeting('14:00', '17:30', '08:0', 90);
chekMeeting('8:00', '17:30', '08:00', 900);
