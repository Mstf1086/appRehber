// Shared display helpers. All output is user-facing (Turkish UI).

// Firestore Timestamp -> Date, Date/string/number passthrough otherwise
export const toDate = (value) => {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  const date = new Date(value)
  return isNaN(date.getTime()) ? null : date
}

export const formatDate = (value) => {
  const parsed = toDate(value)
  if (!parsed) return 'Bilinmiyor'
  return parsed.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const digitsOnly = (value) => (value || '').replace(/[^\d]/g, '')

// "5551234567" -> "555 123 4567", anything else is shown as entered
export const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = digitsOnly(phone)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
  }
  return phone
}

// tel: links need digits only
export const telLink = (phone) => `tel:${digitsOnly(phone)}`

// wa.me links need country code without formatting: 905XXXXXXXXX
export const whatsappLink = (phone) => {
  const digits = digitsOnly(phone)
  if (!digits) return ''
  if (digits.startsWith('90')) return `https://wa.me/${digits}`
  if (digits.startsWith('0')) return `https://wa.me/9${digits}`
  if (digits.startsWith('5') && digits.length === 10) return `https://wa.me/90${digits}`
  return `https://wa.me/${digits}`
}

export const instagramLink = (handle) =>
  `https://instagram.com/${(handle || '').trim().replace(/^@/, '')}`

export const twitterLink = (handle) =>
  `https://twitter.com/${(handle || '').trim().replace(/^@/, '')}`

export const hasLocation = (company) =>
  Boolean(company?.location?.lat && company?.location?.lng)

export const mapsLink = (company) =>
  hasLocation(company)
    ? `https://maps.google.com/?q=${company.location.lat},${company.location.lng}`
    : ''

export const hasSocialMedia = (company) =>
  Boolean(company?.whatsapp || company?.instagram || company?.twitter || hasLocation(company))

export const filterCompanies = (companies, query) => {
  const normalized = (query || '').trim().toLocaleLowerCase('tr-TR')
  if (!normalized) return companies

  return companies.filter((company) =>
    [company.name, company.address, company.phone, company.whatsapp, company.instagram, company.twitter]
      .some((field) => (field || '').toLocaleLowerCase('tr-TR').includes(normalized))
  )
}
