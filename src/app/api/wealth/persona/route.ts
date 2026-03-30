import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
    try {
        const { user_id } = await req.json()
        if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const [profileRes, assetsRes, cashflowRes, insuranceRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user_id).single(),
            supabase.from('client_assets').select('*').eq('user_id', user_id),
            supabase.from('client_cashflow').select('*').eq('user_id', user_id).single(),
            supabase.from('client_insurance').select('*').eq('user_id', user_id)
        ])

        if (profileRes.error) {
            console.error('Profile fetch error:', profileRes.error)
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
        }

        const profile = profileRes.data || {}
        const assets = assetsRes.data || []
        const cashflow = cashflowRes.data || {}
        const insurances = insuranceRes.data || []

        // 1. Calculate Aggregates
        let totalAssetValue = 0
        let totalDebt = 0
        let businessDebt = 0
        let totalLifeCoverage = 0

        assets.forEach(a => {
            if (a.asset_group === 'Nợ') {
                totalDebt += Number(a.amount || 0)
                if (a.is_business_debt) businessDebt += Number(a.amount || 0)
            } else {
                totalAssetValue += Number(a.amount || 0)
            }
        })

        insurances.forEach(i => {
            if ((i.insurance_type === 'life_term' || i.insurance_type === 'life_whole') && !i.is_ci_rider) {
                totalLifeCoverage += Number(i.coverage_amount || 0)
            }
        })

        const annualExpense = Number(cashflow.annual_expense || 0)

        // 2. Gross Needs-based SA
        // debtCov + expLT (10 years) + legacyT (40% assets)
        const debtCov = totalDebt
        const expLT = annualExpense * 10
        const legacyT = totalAssetValue * 0.4
        // Simplified HC Reserve since we don't have exact hc inputs, assume 2B default for HNW
        const hcReserve = 2_000_000_000 
        
        const grossSA = debtCov + expLT + legacyT + hcReserve
        let netSA = grossSA - totalLifeCoverage
        if (netSA < 0) netSA = 0

        // Round to nearest 5 Billion (5_000_000_000)
        let saRounded = Math.ceil(netSA / 5_000_000_000) * 5_000_000_000
        if (saRounded === 0 && netSA > 0) saRounded = 5_000_000_000

        // 3. Elite Tier (Based on saRounded) -> 4B, 15B, 40B
        let eliteTier = 'None'
        let eliteBenefits: string[] = []
        if (saRounded >= 40_000_000_000) {
            eliteTier = 'Elite Infinity'
            eliteBenefits = ['Gói khám bạch kim 50 triệu', 'Cố vấn di sản 50 triệu', 'Y tế hồi hương miễn phí toàn cầu', 'Miễn khám tài chính đến 40 tỷ', 'VIP Lounge']
        } else if (saRounded >= 15_000_000_000) {
            eliteTier = 'Elite Prestige'
            eliteBenefits = ['Khám sức khỏe 18 triệu', 'Dịch vụ tư vấn di sản 20 triệu', 'Miễn khám tài chính đến 40 tỷ', 'VIP Lounge']
        } else if (saRounded >= 4_000_000_000) {
            eliteTier = 'Elite Premier'
            eliteBenefits = ['Khám sức khỏe 10 triệu Vinmec', 'Miễn khám tài chính đến 40 tỷ', 'VIP Lounge']
        }

        // 4. Persona Engine Scoring
        // Base profile markers
        const age = profile.date_of_birth ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear() : 35
        const isMarried = ['Đã kết hôn'].includes(profile.marital_status || '')
        const hasKids = Number(profile.dependents || 0) > 0
        const isCLevel = (profile.occupation || '').toLowerCase().includes('cấp cao') || (profile.occupation || '').toLowerCase().includes('c-level')
        const isSME = profile.employment_type === 'business' || (profile.occupation || '').toLowerCase().includes('chủ')
        const isFreelance = profile.employment_type === 'self_employed'

        // Qualitative psychological markers
        const hStatus = profile.health_status || 'good'
        const priority = profile.financial_priority || 'growth'
        const fear = profile.biggest_fear || 'market'
        const legacyGoal = profile.legacy_goal || 'wealth'
        const succession = profile.succession_plan || 'none'

        let scores = {
            'CD1 (Breadwinner)': 0,
            'CD2A (NextGen Nurturer SME)': 0,
            'CD2B (NextGen C-Level)': 0,
            'CD3 (High Risk Seeker)': 0,
            'CD4 (Heaven Seeker)': 0,
            'CD5 (Family Wealth)': 0
        }

        // --- SCORES CALCULATION ---
        // CD1
        if (age >= 30 && age <= 42) scores['CD1 (Breadwinner)'] += 20
        if (isCLevel) scores['CD1 (Breadwinner)'] += 18
        if (isMarried) scores['CD1 (Breadwinner)'] += 10
        if (hasKids) scores['CD1 (Breadwinner)'] += 15
        if (fear === 'health' || fear === 'income_loss') scores['CD1 (Breadwinner)'] += 15
        if (priority === 'protection') scores['CD1 (Breadwinner)'] += 15
        
        // CD2A
        if (isSME) scores['CD2A (NextGen Nurturer SME)'] += 20
        if (age >= 38 && age <= 48) scores['CD2A (NextGen Nurturer SME)'] += 15
        if (hasKids) scores['CD2A (NextGen Nurturer SME)'] += 18
        if (totalAssetValue >= 10_000_000_000) scores['CD2A (NextGen Nurturer SME)'] += 15 // Proxy for HNW
        if (legacyGoal === 'education') scores['CD2A (NextGen Nurturer SME)'] += 12

        // CD2B
        if (isCLevel) scores['CD2B (NextGen C-Level)'] += 20
        if (age >= 38 && age <= 48) scores['CD2B (NextGen C-Level)'] += 15
        if (hasKids) scores['CD2B (NextGen C-Level)'] += 18
        if (totalAssetValue >= 10_000_000_000) scores['CD2B (NextGen C-Level)'] += 15
        if (fear === 'education') scores['CD2B (NextGen C-Level)'] += 10
        if (isMarried) scores['CD2B (NextGen C-Level)'] += 10

        // CD3
        if (isFreelance) scores['CD3 (High Risk Seeker)'] += 25
        if (age >= 30 && age <= 42) scores['CD3 (High Risk Seeker)'] += 12
        if (fear === 'income_loss' || fear === 'liquidity') scores['CD3 (High Risk Seeker)'] += 18
        if (totalAssetValue >= 10_000_000_000) scores['CD3 (High Risk Seeker)'] += 12
        if (businessDebt > 0) scores['CD3 (High Risk Seeker)'] += 13

        // CD4
        if (age >= 42 && age <= 55) scores['CD4 (Heaven Seeker)'] += 20
        if (totalAssetValue >= 30_000_000_000) scores['CD4 (Heaven Seeker)'] += 18
        if (fear === 'tax' || fear === 'succession') scores['CD4 (Heaven Seeker)'] += 20
        if (priority === 'legacy') scores['CD4 (Heaven Seeker)'] += 18
        if (succession === 'trust' || succession === 'active') scores['CD4 (Heaven Seeker)'] += 14
        if (totalAssetValue >= 50_000_000_000) scores['CD4 (Heaven Seeker)'] += 10

        // CD5
        if (age >= 48) scores['CD5 (Family Wealth)'] += 20
        if (hasKids) scores['CD5 (Family Wealth)'] += 18
        if (totalAssetValue >= 30_000_000_000) scores['CD5 (Family Wealth)'] += 15
        if (legacyGoal === 'wealth') scores['CD5 (Family Wealth)'] += 15
        if (succession === 'trust') scores['CD5 (Family Wealth)'] += 12
        if (totalAssetValue >= 80_000_000_000) scores['CD5 (Family Wealth)'] += 10

        // Find Best Match
        let bestPersona = 'Chưa xác định'
        let maxScore = -1
        Object.entries(scores).forEach(([persona, score]) => {
            if (score > maxScore) {
                maxScore = score
                bestPersona = persona
            }
        })

        // Determine recommended product based on Best Persona
        let recommendedProduct = 'PUL15 (10 Tỷ Bảo vệ)'
        if (bestPersona.includes('SME')) recommendedProduct = 'PUL5 (25 Tỷ)'
        if (bestPersona.includes('C-Level')) recommendedProduct = 'PUL15 (25 Tỷ)'
        if (bestPersona.includes('High Risk')) recommendedProduct = 'PULR (40 Tỷ)'
        if (bestPersona.includes('Heaven Seeker')) recommendedProduct = 'MULA (40 Tỷ)'
        if (bestPersona.includes('Family Wealth')) recommendedProduct = 'PUL15 (100 Tỷ)'

        return NextResponse.json({
            grossSA,
            netSA,
            saRounded,
            eliteTier,
            eliteBenefits,
            personaBreakdown: scores,
            bestPersona,
            bestPersonaScore: maxScore,
            recommendedProduct,
            financialMetrics: {
                totalAssetValue,
                totalDebt,
                businessDebt,
                annualExpense,
                totalLifeCoverage
            }
        })

    } catch (error) {
        console.error('Persona API Error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
