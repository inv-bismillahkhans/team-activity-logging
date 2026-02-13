import { NextResponse } from 'next/server'
import { readSheet, appendRow, ensureHeaders, SHEET_NAMES } from '@/lib/google-sheets'

const HEADERS = ['id', 'name', 'role', 'email', 'color']

function rowToMember(row: string[]) {
  return {
    id: row[0] || '',
    name: row[1] || '',
    role: row[2] || '',
    email: row[3] || '',
    color: row[4] || 'bg-gray-600',
    phone: row[5] || '',
  }
}

export async function GET() {
  try {
    const rows = await readSheet(SHEET_NAMES.MEMBERS)
    if (rows.length <= 1) return NextResponse.json([])
    const members = rows.slice(1).map(rowToMember).filter((m) => m.id)
    return NextResponse.json(members)
  } catch (err) {
    console.error('Members GET error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureHeaders(SHEET_NAMES.MEMBERS, HEADERS)
    const body = await request.json()
    const row = [
      body.id || '',
      body.name || '',
      body.role || '',
      body.email || '',
      body.color || 'bg-gray-600',
    ]
    await appendRow(SHEET_NAMES.MEMBERS, row)
    return NextResponse.json(body)
  } catch (err) {
    console.error('Members POST error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add member' },
      { status: 500 }
    )
  }
}
