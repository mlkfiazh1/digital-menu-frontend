export function getPasswordIssues(password) {
  const issues = []
  if (!password || password.length < 8) issues.push('at least 8 characters')
  if (!/[a-z]/.test(password)) issues.push('one lowercase letter')
  if (!/[A-Z]/.test(password)) issues.push('one uppercase letter')
  if (!/\d/.test(password)) issues.push('one number')
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('one symbol')
  return issues
}

export function isStrongPassword(password) {
  return getPasswordIssues(password).length === 0
}
