import { NextResponse } from 'next/server'
import { readSheet, appendRow, ensureHeaders, SHEET_NAMES } from '@/lib/google-sheets'

const HEADERS = ['id', 'name', 'color', 'icon']

function rowToType(row: string[]) {
  return {
    id: row[0] || '',
    name: row[1] || '',
    color: row[2] || '#000000',
    icon: row[3] || '•',
  }
}

export async function GET() {
  try {
    const rows = await readSheet(SHEET_NAMES.ACTIVITY_TYPES)
    if (rows.length <= 1) return NextResponse.json([])
    const types = rows.slice(1).map(rowToType).filter((t) => t.id)
    return NextResponse.json(types)
  } catch (err) {
    console.error('Activity types GET error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch activity types' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureHeaders(SHEET_NAMES.ACTIVITY_TYPES, HEADERS)
    const body = await request.json()
    const row = [
      body.id || '',
      body.name || '',
      body.color || '#000000',
      body.icon || '•',
    ]
    await appendRow(SHEET_NAMES.ACTIVITY_TYPES, row)
    return NextResponse.json(body)
  } catch (err) {
    console.error('Activity types POST error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add activity type' },
      { status: 500 }
    )
  }
}
