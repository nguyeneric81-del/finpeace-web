'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Calendar, Shield, LogOut,
  ChevronRight, Star, Flame, Award, Lock, Eye, EyeOff, RefreshCw, BookOpen, ChevronDown, CheckCircle,
  FileText, DollarSign, Check, Activity, User, Plus, Edit2, Send, AlertTriangle, Sparkles, Clock,
  ArrowRightLeft, ArrowRight, LockKeyhole, QrCode, Building, Info, UserCheck, ShieldAlert
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/utils/supabase/client'

// Cấu hình định dạng tiền tệ và hiển thị
const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n)
const fmtBig = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + ' tỷ'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' triệu'
  return fmt(n)
}

// Cổ phiếu đề xuất Factsheet mặc định
const RECOMMENDED_STOCKS = [
  {
    code: 'HPG',
    name: 'CTCP Tập đoàn Hòa Phát',
    sector: 'Thép & Vật liệu xây dựng',
    intrinsicValue: 35000,
    maxBuyPrice: 31500,
    growth: '15% - 18%',
    pe: '7.8',
    pb: '1.4',
    cap: '168.4K tỷ',
    grahamChecklist: ['Tài chính lành mạnh (Dợ/Vốn chủ < 1)', 'Lợi nhuận tăng trưởng đều 5 năm', 'Piotroski F-Score: 8/9', 'Biên an toàn định giá: 20%'],
    businessOutlook: '### Hòa Phát (HPG) - Vị thế số 1 ngành thép Việt Nam\n\n* **Động lực tăng trưởng:** Dự án Dung Quất 2 đi vào hoạt động vào cuối năm 2025/2026 sẽ nâng công suất HRC lên gấp đôi, giúp đón đầu chu kỳ phục hồi xây dựng & đầu tư công.\n* **Sức mạnh tài chính:** Khả năng kiểm soát chi phí sản xuất cực tốt nhờ hệ thống lò cao khép kín, biên lợi nhuận gộp dẫn đầu ngành.\n* **Rủi ro:** Biến động giá quặng sắt và than cốc toàn cầu.',
    sipOutlook: 'Phù hợp tích sản lâu dài trong mọi chu kỳ kinh tế nhờ năng lực quản trị xuất sắc của Ban lãnh đạo và vị thế thống lĩnh thị trường.'
  },
  {
    code: 'STB',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    sector: 'Ngân hàng',
    intrinsicValue: 42000,
    maxBuyPrice: 37800,
    growth: '20% - 22%',
    pe: '6.2',
    pb: '1.1',
    cap: '64.2K tỷ',
    grahamChecklist: ['Hoàn tất trích lập VAMC', 'Thu hồi nợ xấu vượt tiến độ', 'Piotroski F-Score: 7/9', 'Biên an toàn định giá: 25%'],
    businessOutlook: '### Sacombank (STB) - Chu kỳ hồi sinh rực rỡ\n\n* **Đòn bẩy tái cơ cấu:** Sau khi trích lập sạch nợ xấu tại VAMC, STB sẽ ghi nhận sự bùng nổ mạnh mẽ về mặt lợi nhuận giữ lại và cải thiện mạnh chỉ số NIM.\n* **Định giá siêu rẻ:** Chỉ số P/B hiện tại quanh 1.1x là mức chiết khấu cực sâu cho một ngân hàng bán lẻ quy mô mạng lưới lớn top đầu.\n* **Rủi ro:** Tiến độ đấu giá phong tỏa cổ phần chậm hơn dự kiến.',
    sipOutlook: 'Ứng viên tích sản bứt phá mạnh trong giai đoạn 2025-2027 nhờ động lực tái cơ cấu thành công toàn diện.'
  },
  {
    code: 'TCB',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    sector: 'Ngân hàng & Dịch vụ tài chính',
    intrinsicValue: 32000,
    maxBuyPrice: 28800,
    growth: '18% - 20%',
    pe: '5.9',
    pb: '0.95',
    cap: '110.8K tỷ',
    grahamChecklist: ['CASA luôn thuộc top đầu (>40%)', 'Chỉ số an toàn vốn CAR cao nhất ngành', 'Piotroski F-Score: 8/9', 'Biên an toàn định giá: 22%'],
    businessOutlook: '### Techcombank (TCB) - Vua hiệu quả hoạt động\n\n* **Lợi thế cạnh tranh vượt trội:** Nguồn vốn CASA dồi dào giúp TCB duy trì chi phí vốn cực thấp, tỷ suất sinh lời trên tài sản (ROA) luôn thuộc top đầu thị trường ngân hàng.\n* **Đa dạng hóa doanh thu:** Mảng dịch vụ (bảo hiểm, trái phiếu, ib) hồi phục mạnh mẽ theo sau sự ổn định của thị trường bất động sản.\n* **Rủi ro:** Mức độ tập trung dư nợ vào bất động sản lớn.',
    sipOutlook: 'Cổ phiếu ngân hàng chất lượng cao hàng đầu dành cho tích sản trung và dài hạn nhờ mô hình quản trị rủi ro vượt trội.'
  },
  {
    code: 'VHM',
    name: 'CTCP Vinhomes',
    sector: 'Bất động sản nhà ở',
    intrinsicValue: 55000,
    maxBuyPrice: 49500,
    growth: '12% - 15%',
    pe: '4.8',
    pb: '0.78',
    cap: '186.2K tỷ',
    grahamChecklist: ['Quỹ đất sạch lớn nhất Việt Nam', 'Doanh thu bán lẻ bàn giao cực mạnh', 'Piotroski F-Score: 7/9', 'Biên an toàn định giá: 35%'],
    businessOutlook: '### Vinhomes (VHM) - Người khổng lồ bất động sản\n\n* **Dự án gối đầu khổng lồ:** Vinhomes Ocean Park 2, 3 và các đại dự án sắp mở bán tại Cổ Loa, Vũ Yên đảm bảo dòng doanh thu bàn giao bền vững cho 3 năm tới.\n* **Định giá chiết khấu lịch sử:** P/E dưới 5x và P/B dưới 1x phản ánh tâm lý e ngại quá đà của thị trường, mở ra cơ hội biên an toàn cực kỳ lớn.\n* **Rủi ro:** Trái phiếu tập đoàn mẹ Vingroup và thanh khoản thị trường địa ốc phục hồi chậm.',
    sipOutlook: 'Lựa chọn tích sản giá trị sâu sắc với biên an toàn lớn chưa từng có, dành cho nhà đầu tư kiên nhẫn.'
  }
]

export default function AIUnifiedSIPPortal() {
  const supabase = useMemo(() => createClient(), [])

  // State quản lý vai trò người dùng (FLOATING SWITCHER)
  const [activeRole, setActiveRole] = useState<'client' | 'sbo' | 'admin'>('client')

  // Auth & Profile state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginEmail, setLoginEmail] = useState('tuananh.vip@finpeace.cloud')
  const [loginPassword, setLoginPassword] = useState('123456')
  const [loginError, setLoginError] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)

  // Khách hàng đang đăng nhập hoặc Khách hàng giả lập đại diện
  const [customer, setCustomer] = useState<any>({
    id: 'demo-customer-uuid',
    email: 'tuananh.vip@finpeace.cloud',
    full_name: 'Nguyễn Tuấn Anh',
    start_date: '2026-01-01',
    end_date: '2029-01-01',
    monthly_target: 10000000, // 10 triệu
    target1_name: 'Mua căn hộ studio Vinhomes',
    target1_value: 1500000000, // 1.5 tỷ
    target1_months: 60,
    broker_company: 'KBSV',
    broker_account: 'KB-889988',
    dealer_name: 'Đặng Minh Đức (Môi giới FinPeace VIP)'
  })

  // Dữ liệu Tích sản
  const [deals, setDeals] = useState<any[]>([])
  const [valuations, setValuations] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Onboarding workflow state (Dành cho Giai đoạn 1)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Health checker calculator (Tham chiếu hệ chỉ số tài chính cá nhân CFP của finpeace.cloud)
  const [healthIncome, setHealthIncome] = useState(30000000) // 30 triệu
  const [healthExpense, setHealthExpense] = useState(15000000) // 15 triệu
  const [healthSipTarget, setHealthSipTarget] = useState(10000000) // 10 triệu
  const [healthDebt, setHealthDebt] = useState(10000000) // 10 triệu nợ
  const [healthLiquidity, setHealthLiquidity] = useState(60000000) // 60 triệu thanh khoản
  const [healthScore, setHealthScore] = useState(85)
  const [healthOutlook, setHealthOutlook] = useState('')
  const [finZone, setFinZone] = useState('phat-trien')
  const [debtRatioState, setDebtRatioState] = useState(0)
  const [emergencyMonthsState, setEmergencyMonthsState] = useState(0)
  const [netWorthState, setNetWorthState] = useState(0)

  // Step 2: Contract signing & payment
  const [contractSignedName, setContractSignedName] = useState('')
  const [contractChecked, setContractChecked] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'verifying' | 'paid'>('unpaid')

  // Step 3: Stock Selection
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['HPG', 'STB'])
  const [viewingFactsheet, setViewingFactsheet] = useState<any>(null)

  // Step 4: Broker linkage
  const [brokerCompany, setBrokerCompany] = useState('KBSV')
  const [brokerAccount, setBrokerAccount] = useState('KB-889988')
  const [autoPlacingEnabled, setAutoPlacingEnabled] = useState(true)

  // Giai đoạn 2: Nurturing - Đồng hành
  const [nurturingTab, setNurturingTab] = useState<'calendar' | 'executions' | 'reports'>('calendar')

  // Giai đoạn 3: Monitoring - Quản trị rủi ro
  const [blackSwanActive, setBlackSwanActive] = useState(false)
  const [swapStockStep, setSwapStockStep] = useState<'warning' | 'comparison' | 'done'>('warning')
  const [swapConfirmed, setSwapConfirmed] = useState(false)

  // Specialist SBO State
  const [sboStockCode, setSboStockCode] = useState('HPG')
  const [sboQuarterUpdate, setSboQuarterUpdate] = useState('Q2-2026')
  const [sboOldIV, setSboOldIV] = useState(32000)
  const [sboNewIV, setSboNewIV] = useState(35000)
  const [sboMaxPrice, setSboMaxPrice] = useState(31500)
  const [sboGrowth, setSboGrowth] = useState('15% - 18%')
  const [sboCta, setSboCta] = useState('MUA TỐT (Strong Buy)')
  const [sboOutlook, setSboOutlook] = useState('### Cập nhật tình hình kinh doanh...\n* Lợi nhuận quý này tăng trưởng tốt.\n* Các chỉ số biên an toàn cao.')
  const [sboSipNote, setSboSipNote] = useState('Hòa Phát vẫn duy trì biên an toàn lớn quanh 20% so với giá trị thực.')
  const [sboSyncMsg, setSboSyncMsg] = useState('')
  const [sboLoading, setSboLoading] = useState(false)

  // Admin CRM State
  const [crmCustomers, setCrmCustomers] = useState<any[]>([])
  const [crmLoading, setCrmLoading] = useState(false)
  const [editingCrmCustomer, setEditingCrmCustomer] = useState<any>(null)
  const [crmNotifyMsg, setCrmNotifyMsg] = useState('')

  // 1. Phép tính toán sức khỏe tài chính & Giả lập tương lai (Áp dụng tiêu chuẩn CFP của finpeace.cloud)
  const handleCalcHealth = useCallback(() => {
    // Tính toán theo tiêu chuẩn finpeace.cloud
    const totalAssets = healthLiquidity + (healthSipTarget * 12)
    const netWorth = totalAssets - healthDebt
    const debtRatio = totalAssets > 0 ? (healthDebt / totalAssets) * 100 : 0
    const emergencyMonths = healthLiquidity / (healthExpense || 1)
    const pyfRate = healthIncome > 0 ? (healthSipTarget / healthIncome) * 100 : 0

    setNetWorthState(netWorth)
    setDebtRatioState(debtRatio)
    setEmergencyMonthsState(emergencyMonths)

    // Xác định Vùng Đất Tài Chính (Zone) theo đúng logic PortfolioReview.tsx của finpeace.cloud
    let zone = 'kiem-soat'
    if (netWorth < 0 || emergencyMonths < 2) {
      zone = 'hoang-vu'
    } else if (netWorth >= 0 && debtRatio > 50) {
      zone = 'kiem-soat'
    } else if (netWorth >= 0 && debtRatio <= 50) {
      if (debtRatio < 20 && pyfRate >= 20 && emergencyMonths >= 6) {
        zone = 'binh-an'
      } else {
        zone = 'phat-trien'
      }
    }
    setFinZone(zone)

    // Tính điểm sức khỏe dựa trên 4 chỉ số sinh tồn CFP
    let score = 50 // Nền
    // PYF
    score += (pyfRate >= 20 ? 15 : pyfRate >= 10 ? 5 : -15)
    // Emergency
    score += (emergencyMonths >= 6 ? 15 : emergencyMonths >= 3 ? 5 : -15)
    // Debt Ratio
    score += (debtRatio < 20 ? 15 : debtRatio < 35 ? 5 : -15)
    // Net Worth
    score += (netWorth > 0 ? 5 : -15)

    const finalScore = Math.max(10, Math.min(100, Math.round(score)))
    setHealthScore(finalScore)

    // Nhận định AI dựa trên Vùng đất Tài chính và điểm
    if (zone === 'binh-an') {
      setHealthOutlook('Tài chính của bạn đạt trạng thái VÙNG BÌNH AN tuyệt vời! Bạn có hầm trú ẩn (quỹ khẩn cấp) siêu vững chãi, mức nợ thấp và tỷ lệ gieo trồng PYF vàng (≥20%). Đây là bệ phóng hoàn hảo giúp lãi kép vận hành tối đa.')
    } else if (zone === 'phat-trien') {
      setHealthOutlook('Bạn thuộc VÙNG PHÁT TRIỂN. Hệ thống tài chính vận hành tốt, dòng tiền tích sản ổn định. Hãy duy trì đều đặn và tiếp tục tối ưu hóa dòng tiền thặng dư để nâng cấp tấm áo giáp an toàn của mình.')
    } else if (zone === 'kiem-soat') {
      setHealthOutlook('Bạn thuộc VÙNG KIỂM SOÁT. Tài sản ròng dương nhưng tỷ lệ nợ còn cao hoặc quỹ dự phòng chưa đủ dày. Cần dọn bớt nợ xấu và củng cố quỹ khẩn cấp để đảm bảo hành trình tích sản không bị đứt gãy.')
    } else {
      setHealthOutlook('⚠️ CẢNH BÁO: Bạn đang ở VÙNG HOANG VU! Quỹ khẩn cấp mỏng (<2 tháng chi tiêu) hoặc tài sản ròng âm. Hãy lập tức dừng nợ mới, thu hẹp chi tiêu không thiết yếu và tập trung xây dựng quỹ dự phòng trú ẩn khẩn cấp.')
    }
  }, [healthIncome, healthExpense, healthSipTarget, healthDebt, healthLiquidity])

  useEffect(() => {
    handleCalcHealth()
  }, [handleCalcHealth])

  // Giả lập tích lũy 10 năm theo CAGR 10%
  const simulatedProjection = useMemo(() => {
    const data = []
    let totalInvested = 0
    let compoundValue = 0
    const monthlyRate = 0.10 / 12 // CAGR 10%

    for (let year = 1; year <= 10; year++) {
      // Đầu tư 12 tháng trong năm
      const yearlySavings = healthSipTarget * 12
      totalInvested += yearlySavings
      // Tính lãi kép cuối năm
      compoundValue = (compoundValue + yearlySavings) * 1.10
      data.push({
        year,
        invested: totalInvested,
        nav: Math.round(compoundValue)
      })
    }
    return data
  }, [healthSipTarget])

  // 2. Fetch dữ liệu từ Supabase hoặc fallback giả lập chất lượng cao
  const fetchData = useCallback(async (userId: string, email: string) => {
    setLoadingData(true)
    try {
      // 1. Fetch Deals/Transactions từ API
      const dealsRes = await fetch(`/api/sip/deals?customerId=${userId}`)
      if (dealsRes.ok) {
        const dealsData = await dealsRes.ok ? await dealsRes.json() : { deals: [] }
        if (dealsData.deals && dealsData.deals.length > 0) {
          setDeals(dealsData.deals)
        } else {
          // Mock deals nếu tài khoản mới
          setDeals([
            { id: '1', order_date: '2026-02-03', ticker: 'HPG', action: 'MUA', target_amount: 10000000, actual_quantity: 360, actual_amount: 9800000, note: 'Khớp lệnh tự động kỳ 1' },
            { id: '2', order_date: '2026-03-03', ticker: 'HPG', action: 'MUA', target_amount: 10000000, actual_quantity: 350, actual_amount: 9950000, note: 'Khớp lệnh tự động kỳ 2' },
            { id: '3', order_date: '2026-04-03', ticker: 'STB', action: 'MUA', target_amount: 10000000, actual_quantity: 280, actual_amount: 9780000, note: 'Khớp lệnh tự động kỳ 3' },
            { id: '4', order_date: '2026-05-03', ticker: 'HPG', action: 'MUA', target_amount: 10000000, actual_quantity: 340, actual_amount: 9920000, note: 'Khớp lệnh tự động kỳ 4' }
          ])
        }
      }

      // 2. Fetch Valuations từ API hoặc direct query
      const valRes = await fetch(`/api/sip/valuations?tickers=HPG,STB,TCB,VHM`)
      if (valRes.ok) {
        const valData = await valRes.json()
        if (valData.valuations && valData.valuations.length > 0) {
          setValuations(valData.valuations)
        } else {
          // Fallback to recommended
          setValuations(RECOMMENDED_STOCKS.map(st => ({
            id: st.code,
            stock_code: st.code,
            quarter_update: 'Q1-2026',
            old_intrinsic_value: st.intrinsicValue - 3000,
            new_intrinsic_value: st.intrinsicValue,
            max_buy_price: st.maxBuyPrice,
            expected_growth: st.growth,
            cta: 'MUA TỐT (Strong Buy)',
            business_outlook: st.businessOutlook,
            sip_outlook: st.sipOutlook
          })))
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoadingData(false)
    }
  }, [])

  // Tải danh sách CRM khi ở vai trò Admin
  const fetchCrmData = async () => {
    setCrmLoading(true)
    try {
      const { data: users, error } = await supabase
        .from('sip_customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && users) {
        setCrmCustomers(users)
      } else {
        // Mock list nếu DB rỗng
        setCrmCustomers([
          { id: 'demo-customer-uuid', full_name: 'Nguyễn Tuấn Anh', email: 'tuananh.vip@finpeace.cloud', monthly_target: 10000000, target1_name: 'Mua căn hộ studio Vinhomes', target1_value: 1500000000, is_active: true, created_at: '2026-01-01', broker_company: 'KBSV', broker_account: 'KB-889988' },
          { id: 'demo2', full_name: 'Trần Thị Mai', email: 'mai.tran@gmail.com', monthly_target: 5000000, target1_name: 'Tự do tài chính tuổi 40', target1_value: 3000000000, is_active: true, created_at: '2026-02-15', broker_company: 'SSI', broker_account: 'SSI-112233' },
          { id: 'demo3', full_name: 'Lê Hoàng Nam', email: 'nam.le@yahoo.com', monthly_target: 20000000, target1_name: 'Quỹ du học cho con', target1_value: 2000000000, is_active: false, created_at: '2026-03-10', broker_company: 'VNDIRECT', broker_account: 'VND-445566' }
        ])
      }
    } catch {
      // Mock list on error
      setCrmCustomers([
        { id: 'demo-customer-uuid', full_name: 'Nguyễn Tuấn Anh', email: 'tuananh.vip@finpeace.cloud', monthly_target: 10000000, target1_name: 'Mua căn hộ studio Vinhomes', target1_value: 1500000000, is_active: true, created_at: '2026-01-01', broker_company: 'KBSV', broker_account: 'KB-889988' }
      ])
    } finally {
      setCrmLoading(false)
    }
  }

  // Khởi động dữ liệu ban đầu
  useEffect(() => {
    if (isLoggedIn && customer) {
      fetchData(customer.id, customer.email)
    }
  }, [isLoggedIn, customer, fetchData])

  useEffect(() => {
    if (activeRole === 'admin') {
      fetchCrmData()
    }
  }, [activeRole])

  // Login handler
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) return
    setLoadingLogin(true)
    setLoginError('')

    try {
      const res = await fetch('/api/sip/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Tài khoản hoặc mật khẩu không hợp lệ.')
        setLoadingLogin(false)
        return
      }

      setCustomer(data.customer)
      setIsLoggedIn(true)
      setOnboardingCompleted(true) // Người dùng cũ mặc định đã onboarding
    } catch {
      // Offline/Local development fallback
      if (loginPassword === '123456') {
        setIsLoggedIn(true)
        setOnboardingCompleted(true)
      } else {
        setLoginError('Lỗi kết nối. Mật khẩu demo là: 123456')
      }
    } finally {
      setLoadingLogin(false)
    }
  }

  // 3. Thực thi Onboarding & Thanh toán giả lập
  const handleVerifyPayment = () => {
    setPaymentStatus('verifying')
    setTimeout(() => {
      setPaymentStatus('paid')
    }, 2500)
  }

  const handleFinishOnboarding = () => {
    // Hoàn thành onboarding -> Lưu vào state và chuyển sang giao diện Dashboard
    setOnboardingCompleted(true)
    // Tự động chèn 1 deal giả lập lúc mở màn để tạo dữ liệu sinh động
    setDeals([
      { id: 'd-init', order_date: new Date().toISOString().slice(0, 10), ticker: selectedTickers[0] || 'HPG', action: 'MUA', target_amount: healthSipTarget, actual_quantity: 0, actual_amount: 0, note: 'Khởi tạo kế hoạch thành công! Đang chờ Broker hỗ trợ khớp lệnh kỳ đầu tiên.' }
    ])
    setCustomer((prev: any) => ({
      ...prev,
      monthly_target: healthSipTarget,
      broker_company: brokerCompany,
      broker_account: brokerAccount,
      target1_name: 'Mục tiêu xây dựng Thịnh vượng',
      target1_value: healthSipTarget * 120 // Giả lập mục tiêu 10 năm
    }))
  }

  // 4. SBO Specialist Handler - Lưu định giá cổ phiếu
  const handleSaveValuation = async () => {
    setSboLoading(true)
    setSboSyncMsg('')

    try {
      const payload = {
        stock_code: sboStockCode.toUpperCase().trim(),
        quarter_update: sboQuarterUpdate,
        old_intrinsic_value: Number(sboOldIV),
        new_intrinsic_value: Number(sboNewIV),
        max_buy_price: Number(sboMaxPrice),
        expected_growth: sboGrowth,
        cta: sboCta,
        business_outlook: sboOutlook,
        sip_outlook: sboSipNote,
        status: 'Published',
        update_date: new Date().toISOString().slice(0, 10)
      }

      const { error } = await supabase
        .from('sip_asset_valuations')
        .insert([payload])

      if (error) throw error

      setSboSyncMsg('✅ Đồng bộ định giá thành công lên Supabase Database!')
      // Reload valuations
      fetchData(customer.id, customer.email)
    } catch (err: any) {
      setSboSyncMsg(`⚠️ Lỗi lưu trữ: ${err.message || 'Chưa phân quyền database admin'}. (Thông tin đã được đồng bộ cục bộ để trải nghiệm).`)
      // Cập nhật local state để trải nghiệm
      setValuations(prev => {
        const exist = prev.filter(v => v.stock_code !== sboStockCode)
        return [...exist, {
          stock_code: sboStockCode,
          quarter_update: sboQuarterUpdate,
          old_intrinsic_value: sboOldIV,
          new_intrinsic_value: sboNewIV,
          max_buy_price: sboMaxPrice,
          expected_growth: sboGrowth,
          cta: sboCta,
          business_outlook: sboOutlook,
          sip_outlook: sboSipNote
        }]
      })
    } finally {
      setSboLoading(false)
    }
  }

  // 5. Admin CRM Handler
  const handleUpdateCrmCustomer = async (cust: any) => {
    setCrmNotifyMsg('')
    try {
      const { error } = await supabase
        .from('sip_customers')
        .update({
          monthly_target: cust.monthly_target,
          is_active: cust.is_active
        })
        .eq('id', cust.id)

      if (error) throw error
      setCrmNotifyMsg(`✅ Cập nhật khách hàng ${cust.full_name} thành công!`)
      fetchCrmData()
      setEditingCrmCustomer(null)
    } catch (err: any) {
      setCrmNotifyMsg(`⚠️ Đồng bộ lỗi: ${err.message}. Đã lưu thay đổi vào bộ nhớ đệm.`)
      // Local edit
      setCrmCustomers(prev => prev.map(c => c.id === cust.id ? cust : c))
      setEditingCrmCustomer(null)
    }
  }

  const handleSendReport = (email: string) => {
    setCrmNotifyMsg('AI đang tạo báo cáo PDF phân tích chuyên sâu...')
    setTimeout(() => {
      setCrmNotifyMsg(`✉️ Đã gửi Báo cáo Tích Sản định kỳ kỳ này tới Email: ${email} thành công!`)
    }, 1500)
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans relative"
      style={{ background: 'linear-gradient(135deg, #060d17 0%, #061e14 50%, #060d17 100%)' }}>
      
      {/* BACKGROUND SHADOW BLURS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #059669, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #0284c7, transparent)' }} />
      </div>

      {/* FLOATING ROLE SWITCHER */}
      <div className="fixed bottom-6 right-6 z-[100] bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex gap-1">
        <button onClick={() => { setActiveRole('client'); }}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeRole === 'client' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}>
          <User className="w-3.5 h-3.5" /> Khách hàng
        </button>
        <button onClick={() => { setActiveRole('sbo'); }}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeRole === 'sbo' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}>
          <Activity className="w-3.5 h-3.5" /> Specialist (SBO)
        </button>
        <button onClick={() => { setActiveRole('admin'); }}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeRole === 'admin' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}>
          <Shield className="w-3.5 h-3.5" /> Admin CRM
        </button>
      </div>

      {/* HEADER PORTAL */}
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
              FinPeace <Sparkles className="w-2.5 h-2.5 fill-emerald-400" /> AI Empowered
            </span>
            <h1 className="text-lg font-black text-white leading-tight">Cổng Hành Trình Tích Sản</h1>
          </div>
        </div>

        {isLoggedIn && activeRole === 'client' && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Khách hàng VIP</p>
              <p className="text-sm font-bold text-emerald-400">{customer?.full_name}</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)}
              className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

        {!isLoggedIn && activeRole === 'client' && (
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-bold">
            Chế độ khách hàng
          </span>
        )}

        {(activeRole === 'sbo' || activeRole === 'admin') && (
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 font-bold">
            {activeRole === 'sbo' ? 'Phân hệ Chuyên viên SBO' : 'Phân hệ CRM Admin'}
          </span>
        )}
      </header>

      {/* CORE PORTAL SCREEN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* ========================================== */}
        {/* ROLE 1: PHÂN HỆ KHÁCH HÀNG (CLIENT PORTAL) */}
        {/* ========================================== */}
        {activeRole === 'client' && (
          <>
            {/* LƯU ĐỒ TRẠNG THÁI: KHƯỚP ĐĂNG NHẬP HOẶC KHƯỚP TRẢI NGHIỆM */}
            {!isLoggedIn ? (
              <div className="max-w-md mx-auto my-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-white">Đăng Nhập Hành Trình</h2>
                  <p className="text-sm text-slate-400 mt-2">Dành riêng cho Hội viên tích sản & Khách hàng ủy thác FinPeace</p>
                </div>

                <div className="glass-card p-8 bg-slate-900/60 border border-white/5 backdrop-blur-xl relative">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">Email tài khoản</label>
                      <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1.5">Mật khẩu</label>
                      <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                    </div>
                    {loginError && <p className="text-xs text-red-400 font-semibold">{loginError}</p>}

                    <button onClick={handleLogin} disabled={loadingLogin}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl text-white font-extrabold text-sm transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                      {loadingLogin ? 'Đang kết nối AI...' : 'Vào Hành Trình Tích Sản của Tôi →'}
                    </button>

                    <div className="border-t border-white/5 pt-4 text-center">
                      <button onClick={() => { setIsLoggedIn(true); setOnboardingCompleted(false); setOnboardingStep(1); }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline transition">
                        Chưa có tài khoản? Khởi động luồng Onboarding mới tại đây →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 1. KHÁCH HÀNG CHƯA ONBOARDING -> HIỂN THỊ LUỒNG TẬP TÀNH ONBOARDING */}
                {!onboardingCompleted ? (
                  <div className="max-w-4xl mx-auto space-y-6">
                    {/* STEPPER BAR */}
                    <div className="glass-card p-6 bg-slate-900/60 border border-white/5 backdrop-blur-xl">
                      <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 right-0 h-0.5 bg-slate-800 z-0 top-1/2 -translate-y-1/2" />
                        <div className="absolute left-0 h-0.5 bg-emerald-500 z-0 top-1/2 -translate-y-1/2 transition-all duration-500" 
                          style={{ width: `${((onboardingStep - 1) / 3) * 100}%` }} />
                        {[
                          { step: 1, label: 'Định hướng' },
                          { step: 2, label: 'Ký hợp đồng & Pay' },
                          { step: 3, label: 'Cổ phiếu lõi' },
                          { step: 4, label: 'Link tài khoản' }
                        ].map((s) => (
                          <div key={s.step} className="relative z-10 flex flex-col items-center">
                            <button onClick={() => { if (s.step < onboardingStep) setOnboardingStep(s.step as any); }}
                              className={`w-10 h-10 rounded-full font-black text-xs transition-all duration-300 flex items-center justify-center ${s.step === onboardingStep ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 scale-110 shadow-lg' : s.step < onboardingStep ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                              {s.step < onboardingStep ? <Check className="w-4 h-4" /> : s.step}
                            </button>
                            <span className={`text-[10px] sm:text-xs font-bold mt-2 ${s.step === onboardingStep ? 'text-emerald-400' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ONBOARDING STEP CONTENT */}
                    <AnimatePresence mode="wait">
                      {onboardingStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                          className="glass-card p-6 sm:p-8 bg-slate-900/60 border border-white/5">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-2">
                            <Target className="text-emerald-400" /> Bước 1: Định Hướng Tích Sản Lành Mạnh
                          </h2>
                          <p className="text-sm text-slate-400 mb-6">Nhập các tham số tài chính cá nhân hiện tại để AI kiểm tra sức khỏe dòng tiền & phác họa tương lai tăng trưởng của bạn.</p>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Input Form */}
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Thu nhập hàng tháng</label>
                                  <div className="relative">
                                    <input type="number" value={healthIncome} onChange={e => setHealthIncome(Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Chi phí sinh hoạt</label>
                                  <div className="relative">
                                    <input type="number" value={healthExpense} onChange={e => setHealthExpense(Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Tài sản thanh khoản</label>
                                  <div className="relative">
                                    <input type="number" value={healthLiquidity} onChange={e => setHealthLiquidity(Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Tổng số nợ hiện có</label>
                                  <div className="relative">
                                    <input type="number" value={healthDebt} onChange={e => setHealthDebt(Number(e.target.value))}
                                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Dòng tiền cam kết tích sản hàng tháng</label>
                                <div className="relative">
                                  <input type="number" value={healthSipTarget} onChange={e => setHealthSipTarget(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">₫</span>
                                </div>
                              </div>
                            </div>

                            {/* Live AI Health Analysis (finpeace.cloud core indicators) */}
                            <div className="bg-slate-950/50 rounded-2xl p-5 border border-white/5 flex flex-col justify-between space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vị trí tài chính hiện tại</p>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-black border ${finZone === 'binh-an' ? 'border-violet-500/30 bg-violet-500/10 text-violet-400' : finZone === 'phat-trien' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : finZone === 'kiem-soat' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                                      {finZone === 'binh-an' ? '🔮 VÙNG BÌNH AN' : finZone === 'phat-trien' ? '🌱 VÙNG PHÁT TRIỂN' : finZone === 'kiem-soat' ? '⚠️ VÙNG KIỂM SOÁT' : '🔥 VÙNG HOANG VU'}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health Score</p>
                                    <p className={`text-xl font-black ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{healthScore} / 100</p>
                                  </div>
                                </div>

                                {/* CFP Survival Indicators */}
                                <div className="grid grid-cols-2 gap-2 mt-3 mb-3 border-t border-b border-white/5 py-2 text-[10px] text-slate-400">
                                  <p>Tài sản ròng: <span className={`font-bold ${netWorthState >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmtBig(netWorthState)}</span></p>
                                  <p>Tỷ lệ nợ: <span className={`font-bold ${debtRatioState < 35 ? 'text-emerald-400' : debtRatioState < 50 ? 'text-amber-400' : 'text-rose-400'}`}>{debtRatioState.toFixed(0)}%</span> (mốc CFP &lt;35%)</p>
                                  <p>Quỹ khẩn cấp: <span className={`font-bold ${emergencyMonthsState >= 6 ? 'text-emerald-400' : emergencyMonthsState >= 3 ? 'text-amber-400' : 'text-rose-400'}`}>{emergencyMonthsState.toFixed(1)} tháng</span> (gợi ý &ge;6m)</p>
                                  <p>Tỷ lệ PYF: <span className={`font-bold ${healthIncome > 0 && (healthSipTarget/healthIncome)*100 >= 20 ? 'text-emerald-400' : 'text-amber-400'}`}>{healthIncome > 0 ? ((healthSipTarget/healthIncome)*100).toFixed(0) : 0}%</span> (đề xuất &ge;20%)</p>
                                </div>

                                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                                  "{healthOutlook}"
                                </p>
                              </div>

                              <div className="border-t border-white/5 pt-3 mt-2 text-[9px] text-slate-500 leading-snug">
                                Hệ chỉ số sinh tồn CFP và Phân Vùng Đất Tài Chính được chuyển giao từ nền tảng Wealth Planning lõi của FinPeace.
                              </div>
                            </div>
                          </div>

                          {/*compounded simulated growth projection list graph*/}
                          <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4" /> Bản đồ giả lập tích lũy lãi kép (Kế hoạch 10 năm với hiệu suất 10%/năm)
                            </h3>
                            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 h-36 items-end border-b border-white/10 pb-1">
                              {simulatedProjection.map((d) => {
                                const maxNav = simulatedProjection[simulatedProjection.length - 1].nav
                                const hPct = (d.nav / maxNav) * 100
                                return (
                                  <div key={d.year} className="flex flex-col items-center justify-end h-full group relative">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 bg-slate-900 border border-emerald-500/30 rounded-lg p-1.5 text-[9px] text-slate-200 hidden group-hover:block z-50 whitespace-nowrap">
                                      <p className="font-bold">Năm {d.year}</p>
                                      <p className="text-emerald-400">NAV: {fmtBig(d.nav)}</p>
                                      <p className="text-slate-400">Gốc: {fmtBig(d.invested)}</p>
                                    </div>

                                    {/* Bar value */}
                                    <div className="w-full bg-emerald-500/20 rounded-t-md relative overflow-hidden transition-all duration-300 hover:bg-emerald-500/40" style={{ height: `${hPct}%` }}>
                                      <div className="absolute bottom-0 left-0 right-0 bg-emerald-500" style={{ height: `${(d.invested / d.nav) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] text-slate-500 mt-1 font-bold">Y{d.year}</span>
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex gap-4 mt-3 justify-center text-[10px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Vốn đầu tư gốc</span>
                              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/30 rounded" /> Lợi nhuận lãi kép tăng trưởng</span>
                            </div>
                          </div>

                          <div className="mt-8 flex justify-end">
                            <button onClick={() => setOnboardingStep(2)}
                              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1">
                              Đồng ý & Sang Bước 2 <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                      </motion.div>
                    )}

                      {onboardingStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                          className="glass-card p-6 sm:p-8 bg-slate-900/60 border border-white/5">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-2">
                            <FileText className="text-emerald-400" /> Bước 2: Ký Hợp Đồng & Thanh Toán Đồng Hành
                          </h2>
                          <p className="text-sm text-slate-400 mb-6">Hoàn thành thủ tục pháp lý điện tử và thanh toán kích hoạt phí dịch vụ tích sản AI.</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Electronic Contract View */}
                            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Hợp Đồng Hỗ Trợ Tích Sản Điện Tử</h3>
                              <div className="h-56 overflow-y-auto text-[10px] text-slate-400 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                <p className="font-bold text-white">ĐIỀU 1: ĐỐI TƯỢNG VÀ PHẠM VI</p>
                                <p>FinPeace cung cấp dịch vụ phân tích, lập kế hoạch tích sản, và hỗ trợ đặt lệnh mua định kỳ dựa trên các thuật toán AI và nhận định chuyên gia đối với các cổ phiếu lõi thuộc Watchlist FinPeace.</p>
                                <p className="font-bold text-white">ĐIỀU 2: KỶ LUẬT ĐẦU TƯ</p>
                                <p>Khách hàng hiểu rằng tích sản là quá trình lâu dài. Khách hàng cam kết tuân thủ mốc chặn mua tối đa (Max Buy Price) do chuyên gia công bố để tránh mua đuổi tài sản giá cao, giảm rủi ro vốn.</p>
                                <p className="font-bold text-white">ĐIỀU 3: BẢO MẬT & ỦY THÁC</p>
                                <p>Quy trình đặt lệnh tự động thông qua Môi giới liên kết (KBSV, SSI) tuân thủ chặt chẽ các quy định pháp luật của Ủy ban Chứng khoán Nhà nước và quy tắc an toàn thông tin của FinPeace.</p>
                              </div>

                              <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Điền họ tên đầy đủ để ký số:</label>
                                  <input type="text" value={contractSignedName} onChange={e => setContractSignedName(e.target.value)}
                                    placeholder="Ví dụ: Nguyễn Tuấn Anh"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={contractChecked} onChange={e => setContractChecked(e.target.checked)}
                                    className="rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-0" />
                                  <span className="text-[10px] text-slate-300 font-bold">Tôi đồng ý ký tên điện tử vào thỏa thuận này.</span>
                                </label>

                                {contractChecked && contractSignedName && (
                                  <div className="mt-2.5 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center">
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest">Digital Signature Verified</p>
                                    <p className="text-lg text-emerald-400 font-extrabold italic font-serif mt-1">{contractSignedName}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Payment Simulator */}
                            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                              <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cổng Thanh Toán Kích Hoạt Phí</h3>
                                
                                {paymentStatus === 'unpaid' && (
                                  <div className="space-y-4">
                                    <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                                      <div>
                                        <p className="text-[10px] text-slate-400 font-medium">Gói dịch vụ AI Accumulator</p>
                                        <p className="text-sm font-black text-white">Đồng hành Tích Sản 12 Tháng</p>
                                      </div>
                                      <p className="text-sm font-black text-emerald-400">1.800.000 ₫</p>
                                    </div>
                                    
                                    <div className="flex gap-4 items-center">
                                      {/* Mock QR Code */}
                                      <div className="w-24 h-24 bg-white rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <QrCode className="w-20 h-20 text-slate-950" />
                                      </div>
                                      <div className="text-[10px] text-slate-400 space-y-1">
                                        <p className="font-bold text-slate-300">Ngân hàng: Techcombank (TCB)</p>
                                        <p>Số tài khoản: <span className="text-white font-bold">190334888899</span></p>
                                        <p>Tên tài khoản: CTCP FINPEACE VIỆT NAM</p>
                                        <p>Nội dung chuyển khoản: <span className="text-emerald-400 font-bold">TS AI {customer.full_name.toUpperCase().replace(/\s+/g,'')}</span></p>
                                      </div>
                                    </div>

                                    <button onClick={handleVerifyPayment} disabled={!contractChecked || !contractSignedName}
                                      className="w-full py-2.5 bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1">
                                      Xác nhận đã chuyển khoản
                                    </button>
                                  </div>
                                )}

                                {paymentStatus === 'verifying' && (
                                  <div className="py-8 text-center space-y-4">
                                    <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent animate-spin rounded-full mx-auto" />
                                    <p className="text-xs text-slate-400 font-semibold animate-pulse">FinPeace AI đang rà soát cổng thanh toán SePay tự động...</p>
                                  </div>
                                )}

                                {paymentStatus === 'paid' && (
                                  <div className="py-6 text-center space-y-3">
                                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                                      <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-black text-emerald-400">Thanh Toán Thành Công!</p>
                                    <p className="text-xs text-slate-400 leading-relaxed">Hợp đồng của bạn đã được đóng mộc số hóa và cấp quyền sử dụng hệ thống tích sản 12 tháng kế tiếp.</p>
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-white/5 pt-4 text-[10px] text-slate-500">
                                Tích hợp an toàn SePay Realtime Bank Transfer Gateway.
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 flex justify-between">
                            <button onClick={() => setOnboardingStep(1)}
                              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs rounded-xl transition">
                              Quay lại
                            </button>
                            <button onClick={() => setOnboardingStep(3)} disabled={paymentStatus !== 'paid'}
                              className="px-6 py-3 bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1">
                              Tiếp tục chọn danh mục <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                      </motion.div>
                    )}

                      {onboardingStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                          className="glass-card p-6 sm:p-8 bg-slate-900/60 border border-white/5">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-2">
                            <Award className="text-emerald-400" /> Bước 3: Xem Factsheet Phân Tích & Chọn Cổ Phiếu Tích Sản
                          </h2>
                          <p className="text-sm text-slate-400 mb-6">FinPeace đã sàng lọc kỹ các cổ phiếu lõi đạt tiêu chuẩn Benjamin Graham & có biên an toàn định giá vượt trội. Click xem chi tiết từng mã và tích chọn đưa vào danh mục của bạn.</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {RECOMMENDED_STOCKS.map((st) => {
                              const isSelected = selectedTickers.includes(st.code)
                              return (
                                <div key={st.code} className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${isSelected ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' : 'border-white/5 bg-slate-950/30 hover:border-white/10'}`}
                                  onClick={() => {
                                    if (isSelected) setSelectedTickers(prev => prev.filter(t => t !== st.code))
                                    else setSelectedTickers(prev => [...prev, st.code])
                                  }}>
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="w-10 h-10 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center font-black text-xs text-emerald-400">
                                        {st.code}
                                      </span>
                                      <button onClick={(e) => { e.stopPropagation(); setViewingFactsheet(st); }}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition">
                                        Đọc Factsheet
                                      </button>
                                    </div>
                                    <p className="text-sm font-bold text-white">{st.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">{st.sector}</p>
                                    
                                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-slate-400 border-t border-white/5 pt-3">
                                      <p>Giá trị nội tại: <span className="text-white font-semibold">{fmt(st.intrinsicValue)}</span></p>
                                      <p>Chặn mua Max Buy: <span className="text-emerald-400 font-semibold">{fmt(st.maxBuyPrice)}</span></p>
                                      <p>Dự kiến tăng trưởng: <span className="text-white font-semibold">{st.growth}</span></p>
                                      <p>P/E hiện tại: <span className="text-white font-semibold">{st.pe}x</span></p>
                                    </div>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500">Tick chọn tích sản</span>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-white/20 bg-slate-900'}`}>
                                      {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <div className="mt-8 flex justify-between">
                            <button onClick={() => setOnboardingStep(2)}
                              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs rounded-xl transition">
                              Quay lại
                            </button>
                            <button onClick={() => setOnboardingStep(4)} disabled={selectedTickers.length === 0}
                              className="px-6 py-3 bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1">
                              Tiếp tục thiết lập tài khoản <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                      </motion.div>
                    )}

                      {onboardingStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                          className="glass-card p-6 sm:p-8 bg-slate-900/60 border border-white/5">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-2 flex-wrap">
                            <LockKeyhole className="text-emerald-400" /> Bước 4: Hỗ Trợ Liên Kết & Tự Động Đặt Lệnh
                            <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-bold uppercase tracking-wider animate-pulse">[Cổng Giả Lập Hỗ Trợ]</span>
                          </h2>
                          <p className="text-sm text-slate-400 mb-6">Kết nối tài khoản chứng khoán của bạn để Chuyên viên Môi giới của FinPeace hỗ trợ đặt lệnh kỷ luật định kỳ. <span className="text-amber-500 font-medium">(Mọi kết nối bên ngoài đang được chạy ở chế độ giả lập an toàn để kiểm thử; kết nối thực tế sẽ được chạy độc lập).</span></p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Link Form */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Công ty chứng khoán liên kết</label>
                                <select value={brokerCompany} onChange={e => setBrokerCompany(e.target.value)}
                                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-emerald-500">
                                  <option value="KBSV">KB Securities Vietnam (KBSV) - Khuyên dùng</option>
                                  <option value="SSI">SSI Securities (SSI)</option>
                                  <option value="VNDIRECT">VNDIRECT (VND)</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-slate-300 block mb-1.5">Số tài khoản chứng khoán</label>
                                <input type="text" value={brokerAccount} onChange={e => setBrokerAccount(e.target.value)}
                                  placeholder="Ví dụ: 033C889988"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500" />
                              </div>

                              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                <div className="flex items-start gap-2.5">
                                  <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  <div className="text-[10px] text-slate-400 space-y-1">
                                    <p className="font-bold text-slate-300">Chưa có tài khoản chứng khoán liên kết?</p>
                                    <p>Đừng lo lắng! FinPeace hỗ trợ mở tài khoản eKYC KBSV/SSI cực nhanh. Liên hệ Môi giới đồng hành hỗ trợ riêng: <span className="text-emerald-400 font-bold">Đặng Minh Đức (0904-888-999)</span>.</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Auto Placing Toggle Option */}
                            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ủy Thác Đặt Lệnh Tự Động</h3>
                                  <button onClick={() => setAutoPlacingEnabled(!autoPlacingEnabled)}
                                    className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 ${autoPlacingEnabled ? 'bg-emerald-500 flex justify-end' : 'bg-slate-800 flex justify-start'}`}>
                                    <div className="w-4.5 h-4.5 bg-slate-950 rounded-full shadow-md" />
                                  </button>
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                  Khi kích hoạt tính năng này, Robot AI và Môi giới FinPeace sẽ tự động quét số dư tài khoản của bạn vào ngày 3 và ngày 18 hàng tháng để tiến hành giải ngân đặt lệnh mua gom các mã: <span className="text-emerald-400 font-semibold">{selectedTickers.join(', ')}</span> theo kế hoạch.
                                </p>

                                {autoPlacingEnabled && (
                                  <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                    <p className="text-[10px] text-slate-300 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Hệ thống Auto-Invest đã sẵn sàng hoạt động!</p>
                                  </div>
                                )}
                              </div>

                              <div className="border-t border-white/5 pt-4 text-[10px] text-slate-500 leading-snug">
                                Bằng việc kích hoạt, bạn xác nhận đồng ý tuân thủ kỷ luật dừng chặn mua khi thị giá vượt Max Buy Price của FinPeace.
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 flex justify-between">
                            <button onClick={() => setOnboardingStep(3)}
                              className="px-4 py-2 border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs rounded-xl transition">
                              Quay lại
                            </button>
                            <button onClick={handleFinishOnboarding}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1">
                              Hoàn Tất Onboarding! Vào Hành Trình <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </div>
                ) : (
                  /* 2. KHÁCH HÀNG ĐÃ ONBOARDING XONG -> HIỂN THỊ ACTIVE ALL-IN-ONE PORTAL DASHBOARD */
                  <div className="space-y-6">
                    {/* TOP STATS BANNER */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* Tóm tắt NAV tích sản */}
                      <div className="glass-card p-5 bg-slate-900/60 border border-white/5 flex flex-col justify-between min-h-32">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tổng giá trị đã tích sản</p>
                          <p className="text-2xl font-black text-white mt-1.5">
                            {fmtBig(deals.reduce((s,d) => s + (d.actual_amount || d.target_amount || 0), 0))}
                          </p>
                        </div>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold"><Sparkles className="w-3 h-3" /> Đã đầu tư {deals.length} kỳ liên tiếp</span>
                      </div>

                      {/* Tiền tích sản hàng tháng */}
                      <div className="glass-card p-5 bg-slate-900/60 border border-white/5 flex flex-col justify-between min-h-32">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Số tiền tích sản hàng tháng</p>
                          <p className="text-2xl font-black text-emerald-400 mt-1.5">
                            {fmtBig(customer.monthly_target)}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">Kỳ góp: Ngày 3 & 18 hàng tháng</span>
                      </div>

                      {/* Tên mục tiêu tích lũy */}
                      <div className="glass-card p-5 bg-slate-900/60 border border-white/5 flex flex-col justify-between min-h-32">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tiến độ mục tiêu</p>
                          <p className="text-base font-bold text-white mt-1.5 truncate">
                            {customer.target1_name || 'Tự do Tài chính'}
                          </p>
                          <p className="text-xs font-black text-indigo-300 mt-0.5">{fmtBig(customer.target1_value || 1000000000)}</p>
                        </div>
                        <div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-indigo-400 rounded-full" 
                              style={{ width: `${Math.min(100, Math.round((deals.reduce((s,d) => s + (d.actual_amount || d.target_amount || 0), 0) / (customer.target1_value || 1000000000)) * 100))}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">Đạt {Math.min(100, Math.round((deals.reduce((s,d) => s + (d.actual_amount || d.target_amount || 0), 0) / (customer.target1_value || 1000000000)) * 100))}% mục tiêu</span>
                        </div>
                      </div>

                      {/* Tài khoản môi giới liên kết */}
                      <div className="glass-card p-5 bg-slate-900/60 border border-white/5 flex flex-col justify-between min-h-32">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Môi giới & Auto Invest</p>
                          <p className="text-sm font-bold text-white mt-1.5">
                            {customer.broker_company} · {customer.broker_account}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{customer.dealer_name}</p>
                        </div>
                        <span className="px-2 py-0.5 w-max bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 rounded-md font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Hệ thống đặt lệnh tự động ON
                        </span>
                      </div>

                    </div>

                    {/* DYNAMIC EMERGENCY WIDGET: MONITORING STAGE */}
                    <div className="glass-card p-5 bg-slate-900/60 border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15"
                        style={{ background: 'radial-gradient(circle, #f43f5e, transparent)' }} />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-bold text-rose-400">Giám sát thiên nga đen</span>
                            <h3 className="text-sm font-extrabold text-white mt-1">Cảnh báo rủi ro & Swap cấu trúc danh mục</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Khởi chạy kịch bản giả lập sự cố bất thường để kiểm thử quy trình bảo vệ của AI.</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => { setBlackSwanActive(!blackSwanActive); setSwapStockStep('warning'); }}
                            className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${blackSwanActive ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>
                            {blackSwanActive ? 'Hủy giả lập Thiên nga đen' : 'Giả lập Thiên nga đen (Black Swan)'}
                          </button>
                        </div>
                      </div>

                      {/* BLACK SWAN ACTIVE MODAL/BOX */}
                      <AnimatePresence>
                        {blackSwanActive && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-rose-500/20 mt-4 pt-4">
                            {!swapConfirmed ? (
                              <div className="space-y-4">
                                {swapStockStep === 'warning' && (
                                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-3">
                                    <p className="text-xs text-rose-400 font-extrabold flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> CẢNH BÁO RỦI RO PHÁP LÝ NGHIÊM TRỌNG (BLACK SWAN ALERT):</p>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                      Hệ thống AI giám sát vĩ mô của FinPeace phát hiện sự kiện khẩn cấp liên quan đến mã <span className="text-rose-400 font-bold">VHM (Vinhomes)</span>: Thay đổi Core Business đột biến và biến động cơ cấu Hội đồng Quản trị sâu sắc có thể ảnh hưởng tới mô hình kinh doanh trong 3 năm tới.
                                    </p>
                                    <div className="flex justify-end gap-2 pt-2">
                                      <button onClick={() => setSwapStockStep('comparison')}
                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-lg transition flex items-center gap-1">
                                        Xem phương án Swap thay thế <ArrowRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {swapStockStep === 'comparison' && (
                                  <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-4">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Bảng So Sánh Thay Thế Danh Mục</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                                        <p className="text-[10px] text-rose-400 font-bold uppercase">Mã loại bỏ</p>
                                        <p className="text-sm font-extrabold text-white mt-1">VHM</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Biên an toàn định giá bị sụt giảm mạnh do thay đổi cốt lõi dòng tiền doanh nghiệp.</p>
                                      </div>
                                      <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase">Mã thay thế khuyến nghị</p>
                                        <p className="text-sm font-extrabold text-white mt-1">HPG</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Động lực dung quất 2 vững chắc, biên an toàn 20%. Đứng vững trong mọi kịch bản cực đoan.</p>
                                      </div>
                                    </div>

                                    <div className="border-t border-white/5 pt-3 space-y-2 text-[10px] text-slate-400">
                                      <p className="font-bold text-white flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Lý do chi tiết từ chuyên gia FinPeace:</p>
                                      <p className="leading-relaxed italic">"Dự án Dung Quất 2 của HPG tiến độ giải ngân đạt 95% sẽ đưa công suất thép cuộn cán nóng Việt Nam tự chủ hoàn toàn. Việc dịch chuyển tỷ trọng tích sản từ VHM sang HPG giúp bảo đảm sự vững tâm của khách hàng trước cú sốc ngành địa ốc."</p>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                      <button onClick={() => setSwapStockStep('warning')}
                                        className="px-3 py-1.5 border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs rounded-lg transition">
                                        Quay lại
                                      </button>
                                      <button onClick={() => { setSwapConfirmed(true); setSwapStockStep('done'); }}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition shadow-lg shadow-emerald-500/10">
                                        Xác nhận Swap (Đổi mã tích sản)
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center space-y-2 animate-fadeIn">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                                  <Check className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-emerald-400 font-black">XÁC NHẬN CHUYỂN ĐỔI MÃ THÀNH CÔNG!</p>
                                <p className="text-[10px] text-slate-400 leading-relaxed">AI đã đồng bộ kế hoạch đổi từ VHM sang HPG tới hồ sơ giao dịch chứng khoán của bạn. Email xác thực đã được gửi tới Môi giới liên kết để điều chỉnh cấu trúc lệnh mua gom tự động.</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* TWO COLUMNS: LEFT WORKSPACE ACTIVE & RIGHT RESEARCH FACTSHEETS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* COLUMN 1 & 2: NURTURING ACTIVE FLOW */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* TAB BAR NURTURING */}
                        <div className="flex gap-2 p-1.5 bg-slate-950 border border-white/5 rounded-2xl">
                          <button onClick={() => setNurturingTab('calendar')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${nurturingTab === 'calendar' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            <Calendar className="w-4 h-4" /> Lịch nhắc kỳ tích sản (Ngày 3 & 18)
                          </button>
                          <button onClick={() => setNurturingTab('executions')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${nurturingTab === 'executions' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            <CheckCircle className="w-4 h-4" /> Nhật ký khớp lệnh thành công
                          </button>
                          <button onClick={() => setNurturingTab('reports')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${nurturingTab === 'reports' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            <BookOpen className="w-4 h-4" /> AI Quarterly Earnings Review
                          </button>
                        </div>

                        {/* TAB CONTENT: CALENDAR (Nhắc nhở nộp tiền) */}
                        {nurturingTab === 'calendar' && (
                          <div className="glass-card p-6 bg-slate-900/60 border border-white/5 space-y-4">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              <Clock className="text-emerald-400" /> Đồng hành Nuôi dưỡng & Lịch nộp tiền Tích Sản
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Để duy trì thói quen tiết kiệm kỷ luật và tự động hóa toàn bộ, hệ thống FinPeace gửi tín hiệu nhắc nhở nộp tiền vào ví đầu tư đúng hạn định.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2 relative overflow-hidden">
                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 rounded">Kỳ tới: Ngày 18</span>
                                <h4 className="text-sm font-bold text-white">Nộp tiền kỳ tháng này</h4>
                                <p className="text-xs text-slate-400">Số tiền tích sản cam kết kỳ 2:</p>
                                <p className="text-lg font-black text-emerald-400">{fmt(customer.monthly_target / 2)} ₫</p>
                                <p className="text-[10px] text-slate-500">Mã CK mục tiêu: {selectedTickers.join(', ')}</p>
                              </div>

                              <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-2">
                                <span className="px-2 py-0.5 bg-slate-800 text-[9px] font-bold text-slate-400 rounded">Kỳ trước: Ngày 3</span>
                                <h4 className="text-sm font-bold text-slate-300">Khớp thành công kỳ 1</h4>
                                <p className="text-xs text-slate-400">Đã giải ngân tự động:</p>
                                <p className="text-base font-bold text-slate-300">{fmt(customer.monthly_target / 2)} ₫</p>
                                <span className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-1"><Check className="w-3 h-3" /> Broker khớp lệnh tự động</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: EXECUTIONS (Nhật ký khớp lệnh) */}
                        {nurturingTab === 'executions' && (
                          <div className="glass-card p-6 bg-slate-900/60 border border-white/5 space-y-4">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              <UserCheck className="text-emerald-400" /> Báo cáo Khớp lệnh Môi giới (FinPeace Broker Assistant)
                            </h3>
                            <p className="text-xs text-slate-400">Dưới đây là nhật ký các lệnh mua tích sản đã được Broker hỗ trợ đặt thành công cho tài khoản của bạn qua các kỳ.</p>

                            <div className="space-y-3">
                              {deals.length === 0 ? (
                                <p className="text-center text-xs text-slate-500 py-6">Đang cập nhật lịch sử giải ngân...</p>
                              ) : (
                                [...deals].reverse().map((d) => (
                                  <div key={d.id} className="p-4 bg-slate-950/70 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center font-black text-xs text-emerald-400">
                                        {d.ticker}
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-white uppercase">{d.action} TÍCH SẢN ({d.ticker})</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{d.order_date} · SKT: {customer.broker_account}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-black text-emerald-400">+{fmtBig(d.actual_amount || d.target_amount)}</p>
                                      <p className="text-[9px] text-slate-400 mt-0.5">{d.actual_quantity > 0 ? `${fmt(d.actual_quantity)} CP` : 'Chờ phân phối'}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: REPORTS (Báo cáo tóm tắt KQKD do AI) */}
                        {nurturingTab === 'reports' && (
                          <div className="glass-card p-6 bg-slate-900/60 border border-white/5 space-y-4">
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              <Sparkles className="text-emerald-400" /> Báo Cáo KQKD Doanh Nghiệp Lõi (AI Summarized)
                            </h3>
                            <p className="text-xs text-slate-400">Được biên soạn hàng quý (tháng 2, 5, 8, 11) bởi AI của FinPeace, bóc tách nhanh sức khỏe tài chính cốt lõi tránh cho bạn việc sa đà vào các tài liệu hàng trăm trang.</p>

                            <div className="space-y-3">
                              {[
                                { qtr: 'BCTC Quý 1/2026', ticker: 'HPG', points: ['Doanh thu thuần đạt 38.5K tỷ đồng (+12% YoY)', 'Biên lợi nhuận gộp phục hồi lên mức 16.5% nhờ giá quặng sắt hạ nhiệt', 'NIM ngành thép duy trì ổn định, dòng tiền kinh doanh thặng dư dồi dào.'] },
                                { qtr: 'BCTC Quý 1/2026', ticker: 'STB', points: ['Lợi nhuận trước thuế đạt 2.9K tỷ đồng (+15% YoY)', 'Thu nhập lãi thuần tăng mạnh 18% sau khi hoàn thành thanh toán nợ trái phiếu VAMC', 'Tỷ lệ nợ xấu duy trì ở mức an toàn quanh 1.25%.'] }
                              ].map((r, i) => (
                                <div key={i} className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-2">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-black text-emerald-400">{r.ticker} · {r.qtr}</span>
                                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">AI Insight</span>
                                  </div>
                                  <ul className="list-disc list-inside text-[10px] text-slate-400 space-y-1">
                                    {r.points.map((p, idx) => <li key={idx}>{p}</li>)}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* COLUMN 3: RIGHT RESEARCH ASSETS (Định giá tài sản) */}
                      <div className="space-y-4">
                        <div className="glass-card p-5 bg-slate-900/60 border border-emerald-500/10">
                          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 mb-2">
                            <Shield className="text-emerald-400 w-4 h-4" /> Giám Sát Định Giá Watchlist
                          </h3>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">Các cổ phiếu tích sản được FinPeace rà soát chặt chẽ hàng ngày để cập nhật chỉ số Max Buy Price. Tuyệt đối tuân thủ kỷ luật chặn mua!</p>

                          <div className="space-y-3">
                            {valuations.map((val) => {
                              const isSelected = selectedTickers.includes(val.stock_code)
                              return (
                                <div key={val.stock_code} className={`p-4 bg-slate-950/70 border rounded-xl space-y-3 transition ${isSelected ? 'border-emerald-500/40' : 'border-white/5'}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 bg-slate-900 border border-white/10 rounded-lg text-xs font-black text-emerald-400">
                                      {val.stock_code}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">Cập nhật {val.quarter_update}</span>
                                  </div>

                                  <div className="space-y-1.5 border-t border-white/5 pt-2 text-[11px] text-slate-400">
                                    <div className="flex justify-between">
                                      <span>Giá trị nội tại:</span>
                                      <span className="text-white font-bold">{fmt(val.new_intrinsic_value || val.intrinsicValue)} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-rose-400 font-bold">Chặn mua Max Buy:</span>
                                      <span className="text-rose-400 font-black">{fmt(val.max_buy_price || val.maxBuyPrice)} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Tăng trưởng kỳ vọng:</span>
                                      <span className="text-white font-semibold">{val.expected_growth || '15%'}</span>
                                    </div>
                                  </div>

                                  <div className="p-2.5 bg-white/5 rounded-lg text-[10px] text-slate-300">
                                    <p className="font-bold text-emerald-400">Khuyến nghị:</p>
                                    <p className="mt-0.5 leading-snug">{val.cta}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ================================================= */}
        {/* ROLE 2: PHÂN HỆ CHUYÊN VIÊN PHÂN TÍCH (SBO PANEL) */}
        {/* ================================================= */}
        {activeRole === 'sbo' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass-card p-6 bg-slate-900/60 border border-indigo-500/10">
              <h2 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                <Activity className="text-indigo-400" /> SBO Cập Nhật Định Giá Cổ Phiếu Tích Sản
              </h2>
              <p className="text-xs text-slate-400 mb-6">Điền số liệu định giá tài chính lõi dưới đây. Dữ liệu sẽ đồng bộ realtime vào bảng `sip_asset_valuations` trên Supabase phục vụ luồng AI của khách hàng.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Mã cổ phiếu</label>
                      <input type="text" value={sboStockCode} onChange={e => setSboStockCode(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Kỳ cập nhật (Quarter)</label>
                      <input type="text" value={sboQuarterUpdate} onChange={e => setSboQuarterUpdate(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Giá trị nội tại cũ</label>
                      <input type="number" value={sboOldIV} onChange={e => setSboOldIV(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Giá trị nội tại mới</label>
                      <input type="number" value={sboNewIV} onChange={e => setSboNewIV(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">Giá chặn tối đa MaxBuy</label>
                      <input type="number" value={sboMaxPrice} onChange={e => setSboMaxPrice(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Khuyên nghị giao dịch (CTA)</label>
                    <select value={sboCta} onChange={e => setSboCta(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                      <option value="MUA TỐT (Strong Buy)">MUA TỐT (Strong Buy) - Chiết khấu sâu & MA200 nền tốt</option>
                      <option value="MUA (Buy)">MUA (Buy) - Có biên an toàn hấp dẫn</option>
                      <option value="TẠM DỪNG MUA (Hold / Stop Buy)">TẠM DỪNG MUA (Hold / Stop Buy) - Không đủ biên an toàn</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tốc độ tăng trưởng dự kiến (%)</label>
                    <input type="text" value={sboGrowth} onChange={e => setSboGrowth(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>

                {/* Markdown Outlook & Note */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Nhận định kinh doanh chi tiết (Markdown)</label>
                    <textarea value={sboOutlook} onChange={e => setSboOutlook(e.target.value)} rows={5}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Nhận định về tích sản (Ghi chú nhanh)</label>
                    <input type="text" value={sboSipNote} onChange={e => setSboSipNote(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>

                  <button onClick={handleSaveValuation} disabled={sboLoading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                    {sboLoading ? 'Đang đồng bộ DB...' : 'Cập Nhật Định Giá Cổ Phiếu Tích Sản →'}
                  </button>
                </div>
              </div>

              {sboSyncMsg && (
                <div className="mt-4 p-3 bg-white/5 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                  {sboSyncMsg}
                </div>
              )}
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="p-6 bg-slate-950 border border-white/5 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Live Valuation Preview</h3>
              <div className="p-4 bg-slate-900 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 rounded-md">{sboStockCode}</span>
                  <p className="text-xs text-slate-400 mt-1">Định giá mới: <span className="text-white font-bold">{fmt(sboNewIV)} ₫</span> (Max Buy: <span className="text-rose-400 font-bold">{fmt(sboMaxPrice)} ₫</span>)</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-[10px] text-emerald-400 font-bold rounded-full border border-emerald-500/20">{sboCta}</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* ROLE 3: PHÂN HỆ CRM ADMIN (ADMIN HUB)   */}
        {/* ======================================= */}
        {activeRole === 'admin' && (
          <div className="space-y-6">
            <div className="glass-card p-6 bg-slate-900/60 border border-sky-500/10">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <UserCheck className="text-sky-400" /> Admin CRM Portal
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Theo dõi, chỉnh sửa trạng thái khách hàng tích sản và gửi báo cáo phân tích định kỳ.</p>
                </div>
                {crmNotifyMsg && (
                  <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-xl text-xs text-sky-300 font-medium">
                    {crmNotifyMsg}
                  </div>
                )}
              </div>

              {/* CRM LIST */}
              {crmLoading ? (
                <p className="text-center text-xs text-slate-500 py-12">Đang nạp danh sách CRM khách hàng...</p>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-2xl bg-slate-950">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-900 text-slate-400 border-b border-white/5">
                      <tr>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Tên Khách Hàng</th>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Email</th>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Dòng Tích Sản</th>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Tài Khoản Liên Kết</th>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Trạng Thái</th>
                        <th className="px-5 py-4 uppercase font-bold text-[10px]">Hành Động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {crmCustomers.map((c) => (
                        <tr key={c.id} className="hover:bg-white/5 transition">
                          <td className="px-5 py-4 font-bold text-white">{c.full_name}</td>
                          <td className="px-5 py-4 text-slate-300">{c.email}</td>
                          <td className="px-5 py-4 font-black text-emerald-400">{fmt(c.monthly_target)} ₫</td>
                          <td className="px-5 py-4 text-slate-400">{c.broker_company} ({c.broker_account})</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${c.is_active !== false ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                              {c.is_active !== false ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-4 flex gap-2">
                            <button onClick={() => setEditingCrmCustomer(c)}
                              className="p-1.5 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-white transition">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleSendReport(c.email)}
                              className="px-2 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 transition text-[10px] font-bold flex items-center gap-1">
                              <Send className="w-3 h-3" /> Gửi báo cáo
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* EDIT MODAL DIALOG */}
            {editingCrmCustomer && (
              <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="glass-card max-w-sm w-full p-6 bg-slate-900 border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Chỉnh sửa thông tin Tích sản: {editingCrmCustomer.full_name}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Dòng tiền đóng tích sản hàng tháng</label>
                      <input type="number" value={editingCrmCustomer.monthly_target} onChange={e => setEditingCrmCustomer({ ...editingCrmCustomer, monthly_target: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Trạng thái dịch vụ</label>
                      <select value={editingCrmCustomer.is_active !== false ? 'active' : 'pending'} onChange={e => setEditingCrmCustomer({ ...editingCrmCustomer, is_active: e.target.value === 'active' })}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                        <option value="active">Active (Hoạt động)</option>
                        <option value="pending">Pending (Đang ký hợp đồng)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setEditingCrmCustomer(null)}
                      className="px-3 py-1.5 border border-white/10 text-slate-300 font-bold text-xs rounded-lg transition">
                      Hủy bỏ
                    </button>
                    <button onClick={() => handleUpdateCrmCustomer(editingCrmCustomer)}
                      className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg transition shadow">
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* STUNNING FACTSHEET VIEW MODAL */}
      {viewingFactsheet && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full max-h-[85vh] overflow-y-auto bg-slate-900 border border-emerald-500/20 p-6 scrollbar-thin scrollbar-thumb-white/10">
            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
              <div>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400 rounded-md">
                  {viewingFactsheet.code}
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5">{viewingFactsheet.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{viewingFactsheet.sector}</p>
              </div>
              <button onClick={() => setViewingFactsheet(null)}
                className="p-2 border border-white/10 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition text-xs font-bold">
                Đóng
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-300">
              
              {/* Infographics parameters */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 rounded-xl p-3 border border-white/5">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Vốn hóa</p>
                  <p className="text-xs font-bold text-white mt-0.5">{viewingFactsheet.cap}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Chỉ số P/E</p>
                  <p className="text-xs font-bold text-white mt-0.5">{viewingFactsheet.pe}x</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Chỉ số P/B</p>
                  <p className="text-xs font-bold text-white mt-0.5">{viewingFactsheet.pb}x</p>
                </div>
              </div>

              {/* Piotroski Graham checklist */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Benjamin Graham Safety Metrics
                </p>
                <ul className="space-y-1 text-[10px] text-slate-400">
                  {viewingFactsheet.grahamChecklist.map((c: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detailed markdown outlook */}
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed border-t border-white/5 pt-4 text-xs
                prose-headings:font-extrabold prose-headings:text-white prose-headings:mb-2 prose-headings:mt-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {viewingFactsheet.businessOutlook}
                </ReactMarkdown>
              </div>

              {/* SIP Accumulation guideline */}
              <div className="p-3 bg-white/5 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                <p className="font-bold text-white">Định hướng đầu tư gom:</p>
                <p className="mt-0.5">{viewingFactsheet.sipOutlook}</p>
              </div>

            </div>

            <div className="flex justify-end pt-6 border-t border-white/5 mt-6">
              <button onClick={() => {
                if (selectedTickers.includes(viewingFactsheet.code)) {
                  setSelectedTickers(prev => prev.filter(t => t !== viewingFactsheet.code))
                } else {
                  setSelectedTickers(prev => [...prev, viewingFactsheet.code])
                }
                setViewingFactsheet(null)
              }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition">
                {selectedTickers.includes(viewingFactsheet.code) ? 'Bỏ chọn cổ phiếu' : 'Chọn tích sản cổ phiếu này'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER SAFE AREA */}
      <footer className="py-8 text-center text-[10px] text-slate-600 border-t border-white/5 mt-12 bg-slate-950/20">
        <p>© 2026 FinPeace Investment Advisory System. Toàn bộ tài sản được giám sát và bảo vệ bởi AI Swarm.</p>
        <p className="mt-1">Hệ thống tuân thủ Luật Kinh doanh Bảo hiểm 2022 và Thẩm định rủi ro tài chính cá nhân chuẩn CFP.</p>
      </footer>

    </div>
  )
}
