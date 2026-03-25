// ──────────────────────────────────────────────────────────────
// Central Sales Configuration for FinPeace
// Cập nhật email của từng sales ở đây khi có email thực.
// Agent code phải khớp với sales_agents.code trong Supabase.
// ──────────────────────────────────────────────────────────────

export interface SalesAgent {
  name: string
  email: string      // Email nhận thông báo lead mới
  agentCode: string  // Code trong URL LP: /lp/[agentCode]/...
}

export const SALES_CONFIG: Record<string, SalesAgent> = {
  mq01: {
    name: 'Minh Quang',
    email: 'minhquang@finpeace.cloud',
    agentCode: 'mq01',
  },
  aduc02: {
    name: 'Anh Đức',
    email: 'ducha@finpeace.vn',
    agentCode: 'aduc02',
  },
  thuy03: {
    name: 'Lê Thuỷ',
    email: 'lethuy@finpeace.cloud',
    agentCode: 'thuy03',
  },
  huyen04: {
    name: 'Minaviko',
    email: 'Huyenltt@kbsec.com.vn',
    agentCode: 'huyen04',
  },
  mduc05: {
    name: 'Minh Đức',
    email: 'minhduc@finpeace.cloud',
    agentCode: 'mduc05',
  },
}

// Email của Manager (luôn nhận CC mọi lead)
export const MANAGER_EMAIL = 'nguyeneric81@gmail.com'

// CC list — luôn nhận CC bất kể sales nào
export const GLOBAL_CC_EMAILS = ['nguyeneric81@gmail.com', 'yenle@finpeace.vn']

// Toàn bộ agent codes dạng mảng
export const AGENT_CODES = Object.keys(SALES_CONFIG)
