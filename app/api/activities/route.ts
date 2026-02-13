import { NextResponse } from 'next/server'
import { readSheet, appendRow, ensureHeaders, SHEET_NAMES } from '@/lib/google-sheets'

const HEADERS = ['id', 'memberId', 'memberName', 'activityType', 'description', 'date', 'duration', 'status']

function rowToActivity(row: string[]) {
  return {
    id: row[0] || '',
    memberId: row[1] || '',
    memberName: row[2] || '',
    activityType: row[3] || '',
    description: row[4] || '',
    date: row[5] ? new Date(row[5]) : new Date(),
    duration: parseInt(row[6] || '0', 10),
    status: row[7] || 'completed',
  }
}

export async function GET() {
  try {
    const rows = await readSheet(SHEET_NAMES.ACTIVITIES)
    if (rows.length <= 1) return NextResponse.json([])
    const activities = rows.slice(1).map(rowToActivity).filter((a) => a.id)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return NextResponse.json(activities)
  } catch (err) {
    console.error('Activities GET error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await ensureHeaders(SHEET_NAMES.ACTIVITIES, HEADERS)
    const body = await request.json()
    const date = body.date instanceof Date ? body.date : new Date(body.date)
    const row = [
      body.id || Date.now().toString(),
      body.memberId || '',
      body.memberName || '',
      body.activityType || '',
      body.description || '',
      date.toISOString().split('T')[0],
      String(body.duration ?? 0),
      body.status || 'completed',
    ]
    await appendRow(SHEET_NAMES.ACTIVITIES, row)
    return NextResponse.json({
      ...body,
      date,
      id: row[0],
    })
  } catch (err) {
    console.error('Activities POST error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to add activity' },
      { status: 500 }
    )
  }
}
