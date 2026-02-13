import { google } from 'googleapis'

const SHEET_NAMES = {
  MEMBERS: 'Members',
  ACTIVITY_TYPES: 'ActivityTypes',
  ACTIVITIES: 'Activities',
} as const

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!email || !privateKey || !sheetId) {
    throw new Error(
      'Missing Google Sheets config. Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local'
    )
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return { auth, sheetId }
}

async function ensureSheetExists(sheetName: string): Promise<void> {
  const { auth, sheetId } = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
  const exists = meta.data.sheets?.some(
    (s) => s.properties?.title === sheetName
  )
  if (exists) return

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: sheetName },
          },
        },
      ],
    },
  })
}

export async function readSheet(sheetName: string): Promise<string[][]> {
  await ensureSheetExists(sheetName)
  const { auth, sheetId } = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:Z`,
  })
  return (res.data.values as string[][]) || []
}

export async function appendRow(sheetName: string, row: string[]): Promise<void> {
  await ensureSheetExists(sheetName)
  const { auth, sheetId } = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:A`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}

export async function ensureHeaders(
  sheetName: string,
  headers: string[]
): Promise<void> {
  const rows = await readSheet(sheetName)
  if (rows.length === 0) {
    await appendRow(sheetName, headers)
  }
}

export { SHEET_NAMES }
