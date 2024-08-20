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

/**
 * Formats a phone number string into a standardized format.
 *
 * This function takes a phone number string as input and formats it into
 * the standard North American format: (XXX) XXX-XXXX
 * If the international code (1) is present, it's formatted as (+1) (XXX) XXX-XXXX.
 *
 * @param {string} phoneNumberString - The input phone number string.
 * @returns {string|null} The formatted phone number string or null if invalid.
 *
 * Example outputs:
 * - With international code:    "+1 (555) 123-4567"
 * - Without international code: "(555) 123-4567"
 */
export function formatPhoneNumber(phoneNumberString: string) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    const intlCode = match[1] ? '+1 ' : ''
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  return null
}
