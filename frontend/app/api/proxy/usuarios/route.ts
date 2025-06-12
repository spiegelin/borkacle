import { NextRequest, NextResponse } from 'next/server'
import api from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const response = await api.get('/api/usuarios')
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Error fetching users' },
      { status: error.response?.status || 500 }
    )
  }
} 