let SlamHelpers = {}

/**
* @function Gets the fallback match if there are no
* matches currently going on
*/
SlamHelpers.getFallbackMatch = (data) => {
  let eventDay = {}
  let matchId = 0

  // grab the first event Day
  eventDay = data.eventDays[0]

  // find the last item with a court
  // id valueof "A"
  for (var i = 0, length = eventDay.matches.length; i < length; i++) {
    if (eventDay.matches[i].courtId === 'A') {
      matchId = eventDay.matches[i].match_id
    }
  }

  return `https://www.usopen.org/webview/en_US/suite/stats/${matchId}.html`
}

export default SlamHelpers
