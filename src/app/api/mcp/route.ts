import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// MCP Tools Definition Schema
const MCP_TOOLS = [
    {
        name: 'company_get_profile',
        description: 'Lấy thông tin cơ bản về doanh nghiệp: Tên công ty, Sàn niêm yết (HOSE/HNX/UPCOM), Nhóm ngành.',
        inputSchema: {
            type: 'object',
            properties: {
                ticker: {
                    type: 'string',
                    description: 'Mã cổ phiếu (VD: HPG, VCB, SSI, FPT)'
                }
            },
            required: ['ticker']
        }
    },
    {
        name: 'financial_get_income_statement',
        description: 'Lấy Báo cáo Kết quả Kinh doanh (Doanh thu, Lợi nhuận, Thu nhập lãi thuần của Bank...) 4 kỳ gần nhất.',
        inputSchema: {
            type: 'object',
            properties: {
                ticker: {
                    type: 'string',
                    description: 'Mã cổ phiếu (VD: HPG, TCB)'
                },
                period: {
                    type: 'string',
                    description: 'Kỳ báo cáo (Q1, Q2, Q3, Q4, YEAR). Để trống để lấy tất cả kỳ gần nhất.'
                },
                year: {
                    type: 'number',
                    description: 'Năm tài chính (VD: 2026). Để trống để lấy các năm gần nhất.'
                }
            },
            required: ['ticker']
        }
    },
    {
        name: 'financial_get_balance_sheet',
        description: 'Lấy Bảng Cân đối kế toán (Tổng tài sản, Vốn chủ, Nợ vay, Tiền gửi KH, Cho vay KH...) 4 kỳ gần nhất.',
        inputSchema: {
            type: 'object',
            properties: {
                ticker: {
                    type: 'string',
                    description: 'Mã cổ phiếu'
                },
                period: {
                    type: 'string',
                    description: 'Kỳ báo cáo (Q1, Q2, Q3, Q4, YEAR)'
                },
                year: {
                    type: 'number',
                    description: 'Năm tài chính'
                }
            },
            required: ['ticker']
        }
    },
    {
        name: 'financial_get_cash_flow',
        description: 'Lấy Báo cáo Lưu chuyển tiền tệ (Dòng tiền kinh doanh, đầu tư, tài chính) 4 kỳ gần nhất.',
        inputSchema: {
            type: 'object',
            properties: {
                ticker: {
                    type: 'string',
                    description: 'Mã cổ phiếu'
                },
                period: {
                    type: 'string',
                    description: 'Kỳ báo cáo (Q1, Q2, Q3, Q4, YEAR)'
                },
                year: {
                    type: 'number',
                    description: 'Năm tài chính'
                }
            },
            required: ['ticker']
        }
    },
    {
        name: 'financial_compare_companies',
        description: 'So sánh nhanh chỉ số tài chính (Doanh thu, Lợi nhuận sau thuế, Tổng tài sản, Vốn chủ) giữa nhiều mã cổ phiếu cùng ngành.',
        inputSchema: {
            type: 'object',
            properties: {
                tickers: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Danh sách các mã cổ phiếu cần so sánh (VD: ["HPG", "NKG", "HSG"] hoặc ["TCB", "MBB", "ACB"])'
                },
                period: {
                    type: 'string',
                    description: 'Kỳ báo cáo so sánh (Mặc định kỳ gần nhất)'
                },
                year: {
                    type: 'number',
                    description: 'Năm tài chính (Mặc định năm gần nhất)'
                }
            },
            required: ['tickers']
        }
    },
    {
        name: 'financial_search_metric',
        description: 'Tìm kiếm chi tiết bất kỳ chỉ tiêu tài chính đặc thù nào trong BCTC gốc (VD: "Cho vay khách hàng", "Chi phí lãi vay", "Doanh thu hoạt động").',
        inputSchema: {
            type: 'object',
            properties: {
                ticker: {
                    type: 'string',
                    description: 'Mã cổ phiếu'
                },
                metric_name: {
                    type: 'string',
                    description: 'Tên chỉ tiêu tài chính cần tìm kiếm (tiếng Việt có dấu hoặc không dấu)'
                }
            },
            required: ['ticker', 'metric_name']
        }
    }
]

// Auth validation helper
async function validateApiKey(req: Request): Promise<{ valid: boolean; user?: any }> {
    const authHeader = req.headers.get('Authorization')
    const { searchParams } = new URL(req.url)
    
    let token = ''
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim()
    } else if (searchParams.get('api_key')) {
        token = searchParams.get('api_key')!.trim()
    } else if (searchParams.get('token')) {
        token = searchParams.get('token')!.trim()
    }

    if (!token) return { valid: false }

    const { data, error } = await supabase
        .from('mcp_api_keys')
        .select('*')
        .eq('api_key', token)
        .eq('is_active', true)
        .single()

    if (error || !data) return { valid: false }

    // Check expiration if set
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false }
    }

    // Async update last_used_at
    supabase
        .from('mcp_api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id)
        .then()

    return { valid: true, user: data }
}

// Tool Execution Logic
async function handleToolCall(name: string, args: any) {
    const ticker = args?.ticker?.toUpperCase()?.trim()

    switch (name) {
        case 'company_get_profile': {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('ticker', ticker)
                .single()
            if (error || !data) return { error: `Không tìm thấy thông tin cho mã ${ticker}` }
            return {
                ticker: data.ticker,
                company_name: data.name,
                exchange: data.exchange,
                industry: data.industry,
                created_at: data.created_at
            }
        }

        case 'financial_get_income_statement': {
            let q = supabase
                .from('income_statements')
                .select('ticker, period, year, revenue, net_revenue, gross_profit, profit_before_tax, net_profit_after_tax, details')
                .eq('ticker', ticker)
                .order('year', { ascending: false })
                .order('period', { ascending: false })

            if (args.period) q = q.eq('period', args.period.toUpperCase())
            if (args.year) q = q.eq('year', args.year)
            q = q.limit(4)

            const { data, error } = await q
            if (error || !data || data.length === 0) return { message: `Chưa có dữ liệu Báo cáo KQKD cho mã ${ticker}` }
            return data
        }

        case 'financial_get_balance_sheet': {
            let q = supabase
                .from('balance_sheets')
                .select('ticker, period, year, total_assets, short_term_assets, long_term_assets, total_liabilities, equity, details')
                .eq('ticker', ticker)
                .order('year', { ascending: false })
                .order('period', { ascending: false })

            if (args.period) q = q.eq('period', args.period.toUpperCase())
            if (args.year) q = q.eq('year', args.year)
            q = q.limit(4)

            const { data, error } = await q
            if (error || !data || data.length === 0) return { message: `Chưa có dữ liệu Cân đối kế toán cho mã ${ticker}` }
            return data
        }

        case 'financial_get_cash_flow': {
            let q = supabase
                .from('cash_flows')
                .select('ticker, period, year, cf_operating, cf_investing, cf_financing, net_cash_flow, details')
                .eq('ticker', ticker)
                .order('year', { ascending: false })
                .order('period', { ascending: false })

            if (args.period) q = q.eq('period', args.period.toUpperCase())
            if (args.year) q = q.eq('year', args.year)
            q = q.limit(4)

            const { data, error } = await q
            if (error || !data || data.length === 0) return { message: `Chưa có dữ liệu Lưu chuyển tiền tệ cho mã ${ticker}` }
            return data
        }

        case 'financial_compare_companies': {
            const rawTickers = args.tickers || []
            const tickers = rawTickers.map((t: string) => t.toUpperCase().trim())
            if (tickers.length === 0) return { error: 'Vui lòng cung cấp ít nhất 1 mã để so sánh' }

            const { data: incomeData } = await supabase
                .from('income_statements')
                .select('ticker, period, year, net_revenue, net_profit_after_tax')
                .in('ticker', tickers)
                .order('year', { ascending: false })
                .order('period', { ascending: false })

            const { data: balanceData } = await supabase
                .from('balance_sheets')
                .select('ticker, period, year, total_assets, equity')
                .in('ticker', tickers)
                .order('year', { ascending: false })
                .order('period', { ascending: false })

            return {
                tickers,
                income_statements: incomeData || [],
                balance_sheets: balanceData || []
            }
        }

        case 'financial_search_metric': {
            const metricName = args.metric_name?.toLowerCase()?.trim()
            if (!metricName) return { error: 'Vui lòng nhập tên chỉ tiêu cần tìm' }

            const { data: incomeData } = await supabase
                .from('income_statements')
                .select('ticker, period, year, details')
                .eq('ticker', ticker)
                .order('year', { ascending: false })
                .limit(4)

            const { data: balanceData } = await supabase
                .from('balance_sheets')
                .select('ticker, period, year, details')
                .eq('ticker', ticker)
                .order('year', { ascending: false })
                .limit(4)

            const results: any[] = []

            const searchInList = (list: any[] | null, statementType: string) => {
                if (!list) return
                list.forEach(item => {
                    if (!item.details) return
                    Object.entries(item.details).forEach(([k, v]) => {
                        if (k.toLowerCase().includes(metricName)) {
                            results.push({
                                type: statementType,
                                period: `${item.year}-${item.period}`,
                                metric: k,
                                value: v
                            })
                        }
                    })
                })
            }

            searchInList(incomeData, 'IncomeStatement')
            searchInList(balanceData, 'BalanceSheet')

            return {
                ticker,
                keyword: metricName,
                matches: results
            }
        }

        default:
            return { error: `Tool ${name} không tồn tại` }
    }
}

// 1. GET /api/mcp - SSE Endpoint
export async function GET(req: Request) {
    const auth = await validateApiKey(req)
    if (!auth.valid) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or missing FinPeace MCP API Key' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
                'WWW-Authenticate': 'Bearer realm="https://finpeace.vn/api/mcp"'
            }
        })
    }

    const { searchParams } = new URL(req.url)
    const token = req.headers.get('Authorization')?.replace('Bearer ', '') || searchParams.get('api_key') || ''
    const sessionId = `fp_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        start(controller) {
            // 1. Send the POST endpoint message for MCP clients
            const postEndpoint = `/api/mcp?session_id=${sessionId}&api_key=${encodeURIComponent(token)}`
            controller.enqueue(encoder.encode(`event: endpoint\ndata: ${postEndpoint}\n\n`))

            // 2. Keep-alive heartbeat
            const interval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`: heartbeat\n\n`))
                } catch {
                    clearInterval(interval)
                }
            }, 15000)

            req.signal.addEventListener('abort', () => {
                clearInterval(interval)
                controller.close()
            })
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    })
}

// 2. POST /api/mcp - JSON-RPC Message Handler
export async function POST(req: Request) {
    const auth = await validateApiKey(req)
    if (!auth.valid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let payload: any
    try {
        payload = await req.json()
    } catch {
        return NextResponse.json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }, { status: 400 })
    }

    const { jsonrpc, id, method, params } = payload

    if (method === 'initialize') {
        return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {}
                },
                serverInfo: {
                    name: 'finpeace-corporate-mcp',
                    version: '1.0.0'
                }
            }
        })
    }

    if (method === 'notifications/initialized') {
        return new Response(null, { status: 204 })
    }

    if (method === 'ping') {
        return NextResponse.json({ jsonrpc: '2.0', id, result: {} })
    }

    if (method === 'tools/list') {
        return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
                tools: MCP_TOOLS
            }
        })
    }

    if (method === 'tools/call') {
        const toolName = params?.name
        const toolArgs = params?.arguments || {}

        try {
            const output = await handleToolCall(toolName, toolArgs)
            return NextResponse.json({
                jsonrpc: '2.0',
                id,
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(output, null, 2)
                        }
                    ]
                }
            })
        } catch (err: any) {
            return NextResponse.json({
                jsonrpc: '2.0',
                id,
                error: {
                    code: -32603,
                    message: err.message || 'Internal tool execution error'
                }
            })
        }
    }

    return NextResponse.json({
        jsonrpc: '2.0',
        id,
        error: {
            code: -32601,
            message: `Method ${method} not found`
        }
    })
}
