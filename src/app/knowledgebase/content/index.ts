import type { ContentBlock } from '../data'
import { content as nguoiBanCoPHieu } from './tam-ly-thi-truong/nguoi-ban-co-phieu'
import { content as fomoVaBauDan } from './tam-ly-thi-truong/fomo-va-bau-dan'
import { content as kyLuatGiaoDich } from './tam-ly-thi-truong/ky-luat-giao-dich'
import { content as loNgaiThuaLo } from './tam-ly-thi-truong/lo-ngai-thua-lo'
import { content as coPHieuLaGi } from './co-che-thi-truong/co-phieu-la-gi'
import { content as cachDatLenh } from './co-che-thi-truong/cach-dat-lenh'
// Tháng 2 — Investor Track
import { content as docBaoCaoTaiChinh } from './phan-tich-co-ban/doc-bao-cao-tai-chinh'
import { content as bienLoiNhuan } from './phan-tich-co-ban/bien-loi-nhuan'
import { content as dinhGiaCoPHieu } from './phan-tich-co-ban/dinh-gia-co-phieu'
import { content as bienDoAnToan } from './dau-tu-gia-tri/bien-do-an-toan'
import { content as loiTheCanhTranh } from './dau-tu-gia-tri/loi-the-canh-tranh'
import { content as tieuChiFisher } from './dau-tu-tang-truong/15-tieu-chi-fisher'
import { content as muaNhungGiBanBiet } from './dau-tu-tang-truong/mua-nhung-gi-ban-biet'
// Tháng 3 — Trader Track
import { content as nenNhat } from './phan-tich-ky-thuat/nen-nhat'
import { content as hoTroKhangCu } from './phan-tich-ky-thuat/ho-tro-khang-cu'
import { content as khoiLuongGiaoDich } from './phan-tich-ky-thuat/khoi-luong-giao-dich'
import { content as macdRsi } from './phan-tich-ky-thuat/macd-rsi'
import { content as lyThuyetHopDarvas } from './giao-dich-theo-xu-huong/ly-thuyet-hop-darvas'
import { content as turtleTraders } from './giao-dich-theo-xu-huong/turtle-traders'

export const CONTENT_REGISTRY: Record<string, ContentBlock[]> = {
    'tam-ly-thi-truong/nguoi-ban-co-phieu': nguoiBanCoPHieu,
    'tam-ly-thi-truong/fomo-va-bau-dan': fomoVaBauDan,
    'tam-ly-thi-truong/ky-luat-giao-dich': kyLuatGiaoDich,
    'tam-ly-thi-truong/lo-ngai-thua-lo': loNgaiThuaLo,
    'co-che-thi-truong/co-phieu-la-gi': coPHieuLaGi,
    'co-che-thi-truong/cach-dat-lenh': cachDatLenh,
    // Tháng 2 — Investor Track
    'phan-tich-co-ban/doc-bao-cao-tai-chinh': docBaoCaoTaiChinh,
    'phan-tich-co-ban/bien-loi-nhuan': bienLoiNhuan,
    'phan-tich-co-ban/dinh-gia-co-phieu': dinhGiaCoPHieu,
    'dau-tu-gia-tri/bien-do-an-toan': bienDoAnToan,
    'dau-tu-gia-tri/loi-the-canh-tranh': loiTheCanhTranh,
    'dau-tu-tang-truong/15-tieu-chi-fisher': tieuChiFisher,
    'dau-tu-tang-truong/mua-nhung-gi-ban-biet': muaNhungGiBanBiet,
    // Tháng 3 — Trader Track
    'phan-tich-ky-thuat/nen-nhat': nenNhat,
    'phan-tich-ky-thuat/ho-tro-khang-cu': hoTroKhangCu,
    'phan-tich-ky-thuat/khoi-luong-giao-dich': khoiLuongGiaoDich,
    'phan-tich-ky-thuat/macd-rsi': macdRsi,
    'giao-dich-theo-xu-huong/ly-thuyet-hop-darvas': lyThuyetHopDarvas,
    'giao-dich-theo-xu-huong/turtle-traders': turtleTraders,
}

export function getArticleContent(pillarSlug: string, articleSlug: string): ContentBlock[] | null {
    return CONTENT_REGISTRY[`${pillarSlug}/${articleSlug}`] ?? null
}
