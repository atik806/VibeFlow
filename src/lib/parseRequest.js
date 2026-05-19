export function parseRequest(row) {
  if (!row || !row.prompt) return row

  let data
  try {
    data = JSON.parse(row.prompt)
  } catch {
    return row
  }

  if (data && typeof data === 'object' && data.name) {
    return {
      ...row,
      _parsed: true,
      name: data.name,
      email: data.email,
      service: data.service,
      subcategory: data.subcategory,
      description: data.description,
      budget: data.budget,
    }
  }

  return row
}
