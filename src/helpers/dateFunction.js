
export const formatDate = function (dateString) {
  const ar = dateString.split('-')
  return ar[2] + '.' + ar[1] + '.' + ar[0]
}

export const isPast = function (dateString) {
  const dt = new Date(dateString)
  const today = new Date()
  return today.getTime() > dt.getTime()
}

export const getAge = function (dateOfBirthString) {
  const dt = new Date(dateOfBirthString)
  const today = new Date()

  // TODO age muze byt take konstanta
 const age = today.getFullYear() - dt.getFullYear()

  // TODO tady neni funkce getFullYear zavolanan vubec
  dt.setFullYear(today.getFullYear())

  return (dt.getTime() < today.getTime()) ? age : age - 1
}

// getAge('1973-08-18') => 49