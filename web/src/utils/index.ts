// Convert strings like "2023-12-13T18:32:32.080Z" to "Dec 13th 2023, 1:32:32 PM"
export function formatDateString(dateString) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  function getOrdinalNum(n) {
    return (
      n +
      (n > 0
        ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
        : '')
    )
  }

  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = monthNames[date.getMonth()]
  const day = getOrdinalNum(date.getDate())
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12

  return `${month} ${day} ${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`
}
