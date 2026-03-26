import type { ContentBlock } from '../data'

// Tài Chính Cá Nhân (Level 1)
import { content as bucTranhTaiChinh } from './tai-chinh-ca-nhan/buc-tranh-tai-chinh'
import { content as quanLyDongTien } from './tai-chinh-ca-nhan/quan-ly-dong-tien'
import { content as chienLuocThoatNo } from './tai-chinh-ca-nhan/chien-luoc-thoat-no'
import { content as quyKhanCap } from './tai-chinh-ca-nhan/quy-khan-cap'
import { content as lamPhatVaLaiKep } from './tai-chinh-ca-nhan/lam-phat-va-lai-kep'
import { content as dinhGiaBanThan } from './tai-chinh-ca-nhan/dinh-gia-ban-than'
import { content as thietLapMucTieu } from './tai-chinh-ca-nhan/thiet-lap-muc-tieu'
import { content as nguoiBanCoPHieu } from './tam-ly-thi-truong/nguoi-ban-co-phieu'
import { content as fomoVaBauDan } from './tam-ly-thi-truong/fomo-va-bau-dan'
import { content as kyLuatGiaoDich } from './tam-ly-thi-truong/ky-luat-giao-dich'
import { content as loNgaiThuaLo } from './tam-ly-thi-truong/lo-ngai-thua-lo'
import { content as cognitiveBiases } from './tam-ly-thi-truong/cognitive-biases'
import { content as sunkCostFallacy } from './tam-ly-thi-truong/sunk-cost-fallacy'
import { content as coPHieuLaGi } from './co-che-thi-truong/co-phieu-la-gi'
import { content as cachDatLenh } from './co-che-thi-truong/cach-dat-lenh'
import { content as marginTrading } from './co-che-thi-truong/margin-trading'
// Tháng 2 — Investor Track
import { content as docBaoCaoTaiChinh } from './phan-tich-co-ban/doc-bao-cao-tai-chinh'
import { content as bienLoiNhuan } from './phan-tich-co-ban/bien-loi-nhuan'
import { content as dinhGiaCoPHieu } from './phan-tich-co-ban/dinh-gia-co-phieu'
import { content as dongTienTuDo } from './phan-tich-co-ban/dong-tien-tu-do'
import { content as roeVaDupont } from './phan-tich-co-ban/roe-va-dupont'
import { content as bienDoAnToan } from './dau-tu-gia-tri/bien-do-an-toan'
import { content as loiTheCanhTranh } from './dau-tu-gia-tri/loi-the-canh-tranh'
import { content as mungerMentalModels } from './dau-tu-gia-tri/munger-mental-models'
import { content as valueTrap } from './dau-tu-gia-tri/value-trap'
import { content as tieuChiFisher } from './dau-tu-tang-truong/15-tieu-chi-fisher'
import { content as muaNhungGiBanBiet } from './dau-tu-tang-truong/mua-nhung-gi-ban-biet'
// Tháng 3 — Trader Track
import { content as nenNhat } from './phan-tich-ky-thuat/nen-nhat'
import { content as hoTroKhangCu } from './phan-tich-ky-thuat/ho-tro-khang-cu'
import { content as khoiLuongGiaoDich } from './phan-tich-ky-thuat/khoi-luong-giao-dich'
import { content as macdRsi } from './phan-tich-ky-thuat/macd-rsi'
import { content as moHinhGia } from './phan-tich-ky-thuat/mo-hinh-gia'
import { content as fibonacciRetracement } from './phan-tich-ky-thuat/fibonacci-retracement'
import { content as lyThuyetHopDarvas } from './giao-dich-theo-xu-huong/ly-thuyet-hop-darvas'
import { content as turtleTraders } from './giao-dich-theo-xu-huong/turtle-traders'
// Tháng 4 — Mastery Track
import { content as daDangHoa } from './quan-ly-danh-muc/da-dang-hoa'
import { content as dollarCostAveraging } from './quan-ly-danh-muc/dollar-cost-averaging'
import { content as catLo } from './quan-tri-rui-ro/cat-lo'
import { content as positionSizing } from './quan-tri-rui-ro/position-sizing'
import { content as drawdownRecovery } from './quan-tri-rui-ro/drawdown-recovery'
import { content as investmentPolicyStatement } from './ke-hoach-thuc-chien/investment-policy-statement'
import { content as paperTrading } from './ke-hoach-thuc-chien/paper-trading'
// Huyền Thoại Đầu Tư
import { content as peterLynchOneUp } from './huyen-thoai-dau-tu/peter-lynch-one-up'

export const CONTENT_REGISTRY: Record<string, ContentBlock[]> = {
    // Tài Chính Cá Nhân
    'tai-chinh-ca-nhan/buc-tranh-tai-chinh': bucTranhTaiChinh,
    'tai-chinh-ca-nhan/quan-ly-dong-tien': quanLyDongTien,
    'tai-chinh-ca-nhan/chien-luoc-thoat-no': chienLuocThoatNo,
    'tai-chinh-ca-nhan/quy-khan-cap': quyKhanCap,
    'tai-chinh-ca-nhan/lam-phat-va-lai-kep': lamPhatVaLaiKep,
    'tai-chinh-ca-nhan/dinh-gia-ban-than': dinhGiaBanThan,
    'tai-chinh-ca-nhan/thiet-lap-muc-tieu': thietLapMucTieu,

    'tam-ly-thi-truong/nguoi-ban-co-phieu': nguoiBanCoPHieu,
    'tam-ly-thi-truong/fomo-va-bau-dan': fomoVaBauDan,
    'tam-ly-thi-truong/ky-luat-giao-dich': kyLuatGiaoDich,
    'tam-ly-thi-truong/lo-ngai-thua-lo': loNgaiThuaLo,
    'tam-ly-thi-truong/cognitive-biases': cognitiveBiases,
    'tam-ly-thi-truong/sunk-cost-fallacy': sunkCostFallacy,
    'co-che-thi-truong/co-phieu-la-gi': coPHieuLaGi,
    'co-che-thi-truong/cach-dat-lenh': cachDatLenh,
    'co-che-thi-truong/margin-trading': marginTrading,
    // Tháng 2 — Investor Track
    'phan-tich-co-ban/doc-bao-cao-tai-chinh': docBaoCaoTaiChinh,
    'phan-tich-co-ban/bien-loi-nhuan': bienLoiNhuan,
    'phan-tich-co-ban/dinh-gia-co-phieu': dinhGiaCoPHieu,
    'phan-tich-co-ban/dong-tien-tu-do': dongTienTuDo,
    'phan-tich-co-ban/roe-va-dupont': roeVaDupont,
    'dau-tu-gia-tri/bien-do-an-toan': bienDoAnToan,
    'dau-tu-gia-tri/loi-the-canh-tranh': loiTheCanhTranh,
    'dau-tu-gia-tri/munger-mental-models': mungerMentalModels,
    'dau-tu-gia-tri/value-trap': valueTrap,
    'dau-tu-tang-truong/15-tieu-chi-fisher': tieuChiFisher,
    'dau-tu-tang-truong/mua-nhung-gi-ban-biet': muaNhungGiBanBiet,
    // Tháng 3 — Trader Track
    'phan-tich-ky-thuat/nen-nhat': nenNhat,
    'phan-tich-ky-thuat/ho-tro-khang-cu': hoTroKhangCu,
    'phan-tich-ky-thuat/khoi-luong-giao-dich': khoiLuongGiaoDich,
    'phan-tich-ky-thuat/macd-rsi': macdRsi,
    'phan-tich-ky-thuat/mo-hinh-gia': moHinhGia,
    'phan-tich-ky-thuat/fibonacci-retracement': fibonacciRetracement,
    'giao-dich-theo-xu-huong/ly-thuyet-hop-darvas': lyThuyetHopDarvas,
    'giao-dich-theo-xu-huong/turtle-traders': turtleTraders,
    // Tháng 4 — Mastery Track
    'quan-ly-danh-muc/da-dang-hoa': daDangHoa,
    'quan-ly-danh-muc/dollar-cost-averaging': dollarCostAveraging,
    'quan-tri-rui-ro/cat-lo': catLo,
    'quan-tri-rui-ro/position-sizing': positionSizing,
    'quan-tri-rui-ro/drawdown-recovery': drawdownRecovery,
    'ke-hoach-thuc-chien/investment-policy-statement': investmentPolicyStatement,
    'ke-hoach-thuc-chien/paper-trading': paperTrading,
    // Huyền Thoại Đầu Tư
    'huyen-thoai-dau-tu/peter-lynch-one-up': peterLynchOneUp,
}

export function getArticleContent(pillarSlug: string, articleSlug: string): ContentBlock[] | null {
    return CONTENT_REGISTRY[`${pillarSlug}/${articleSlug}`] ?? null
}
