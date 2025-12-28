import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// 1. 在初始化时直接锁定 schema，解决 withSchema 不存在的问题
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: 'soul' } }
)

// 2. 明确 export 异步函数，确保它被识别为标准模块
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 既然初始化已锁定 soul，这里直接 form 即可
    const { error } = await supabase
      .from('life_fragments')
      .insert([{ 
        content: body.content, 
        source: 'spirit-soar-bridge', 
        created_at: new Date().toISOString() 
      }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unknown Error' }, 
      { status: 500 }
    )
  }
}

// 3. 必须包含 OPTIONS 处理，防止扩展请求被 CORS 拦截
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}