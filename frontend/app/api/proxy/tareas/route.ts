import { NextRequest, NextResponse } from 'next/server'
import api from '@/lib/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await api.post('/api/tareas', body)
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Error creating task' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = await api.get('/api/tareas')
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Error fetching tasks' },
      { status: error.response?.status || 500 }
    )
  }
} 