import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'soul' } }
)

// 定义通用的 CORS 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 允许所有来源，包括你的扩展
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 1. 必须处理 OPTIONS 请求（预检请求）
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// 2. 在 POST 响应中也带上这些头
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { error } = await supabase
      .from('life_fragments')
      .insert([{ 
        content: body.content, 
        source: 'spirit-soar-bridge', 
        created_at: new Date().toISOString() 
      }])

    if (error) throw error

    return NextResponse.json({ success: true }, { headers: corsHeaders })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown Error' }, 
      { status: 500, headers: corsHeaders }
    )
  }
}