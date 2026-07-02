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
import { content as jesseLivermoreStockOperator } from './huyen-thoai-dau-tu/jesse-livermore-stock-operator'
import { content as williamOneilCanslim } from './huyen-thoai-dau-tu/william-oneil-canslim'
import { content as darvasBoxTheory } from './huyen-thoai-dau-tu/darvas-box-theory'
import { content as buffettTheSnowball } from './huyen-thoai-dau-tu/buffett-the-snowball'

// Phân Tích Doanh Nghiệp (VVIA)
import { content as vviaBankMbb } from './phan-tich-doanh-nghiep/vvia-bank-mbb-2026'
import { vviaBankVcb2026 as vviaBankVcb } from './phan-tich-doanh-nghiep/vvia-bank-vcb-2026'
import { vviaBankTcb2026 as vviaBankTcb } from './phan-tich-doanh-nghiep/vvia-bank-tcb-2026'
import { vviaBankVpb2026 as vviaBankVpb } from './phan-tich-doanh-nghiep/vvia-bank-vpb-2026'
import { vviaBankAcb2026 as vviaBankAcb } from './phan-tich-doanh-nghiep/vvia-bank-acb-2026'
import { vviaBankCtg2026 as vviaBankCtg } from './phan-tich-doanh-nghiep/vvia-bank-ctg-2026'
import { vviaBankBid2026 as vviaBankBid } from './phan-tich-doanh-nghiep/vvia-bank-bid-2026'
import { vviaBankStb2026 as vviaBankStb } from './phan-tich-doanh-nghiep/vvia-bank-stb-2026'
import { vviaBankVib2026 as vviaBankVib } from './phan-tich-doanh-nghiep/vvia-bank-vib-2026'
import { vviaBankTpb2026 as vviaBankTpb } from './phan-tich-doanh-nghiep/vvia-bank-tpb-2026'
import { vviaBankHdb2026 as vviaBankHdb } from './phan-tich-doanh-nghiep/vvia-bank-hdb-2026'
import { vviaBankLpb2026 as vviaBankLpb } from './phan-tich-doanh-nghiep/vvia-bank-lpb-2026'
import { vviaBankShb2026 as vviaBankShb } from './phan-tich-doanh-nghiep/vvia-bank-shb-2026'
import { vviaBankEib2026 as vviaBankEib } from './phan-tich-doanh-nghiep/vvia-bank-eib-2026'
import { vviaBankMsb2026 as vviaBankMsb } from './phan-tich-doanh-nghiep/vvia-bank-msb-2026'
import { vviaBankOcb2026 as vviaBankOcb } from './phan-tich-doanh-nghiep/vvia-bank-ocb-2026'
import { vviaBankSsb2026 as vviaBankSsb } from './phan-tich-doanh-nghiep/vvia-bank-ssb-2026'
import { vviaBankNab2026 as vviaBankNab } from './phan-tich-doanh-nghiep/vvia-bank-nab-2026'
import { vviaBankAbb2026 as vviaBankAbb } from './phan-tich-doanh-nghiep/vvia-bank-abb-2026'
import { vviaBankBab2026 as vviaBankBab } from './phan-tich-doanh-nghiep/vvia-bank-bab-2026'
import { vviaBankNvb2026 as vviaBankNvb } from './phan-tich-doanh-nghiep/vvia-bank-nvb-2026'
import { vviaBankKlb2026 as vviaBankKlb } from './phan-tich-doanh-nghiep/vvia-bank-klb-2026'
import { vviaBankBvb2026 as vviaBankBvb } from './phan-tich-doanh-nghiep/vvia-bank-bvb-2026'
import { vviaBankPgb2026 as vviaBankPgb } from './phan-tich-doanh-nghiep/vvia-bank-pgb-2026'
import { vviaBankVab2026 as vviaBankVab } from './phan-tich-doanh-nghiep/vvia-bank-vab-2026'
import { vviaBankSgb2026 as vviaBankSgb } from './phan-tich-doanh-nghiep/vvia-bank-sgb-2026'
import { content as vviaTechFpt } from './phan-tich-doanh-nghiep/vvia-tech-fpt-2026'
import { vviaSteelHpg2026 as vviaSteelHpg } from './phan-tich-doanh-nghiep/vvia-steel-hpg-2026'
import { vviaSecuritiesSsi2026 as vviaSecuritiesSsi } from './phan-tich-doanh-nghiep/vvia-securities-ssi-2026'
import { content as vviaSecuritiesVnd } from './phan-tich-doanh-nghiep/vvia-securities-vnd-2026'
import { content as vviaSecuritiesVci } from './phan-tich-doanh-nghiep/vvia-securities-vci-2026'
import { content as vviaSecuritiesHcm } from './phan-tich-doanh-nghiep/vvia-securities-hcm-2026'
import { content as vviaSecuritiesShs } from './phan-tich-doanh-nghiep/vvia-securities-shs-2026'
import { content as vviaSecuritiesMbs } from './phan-tich-doanh-nghiep/vvia-securities-mbs-2026'
import { content as vviaSecuritiesVix } from './phan-tich-doanh-nghiep/vvia-securities-vix-2026'
import { content as vviaSecuritiesFts } from './phan-tich-doanh-nghiep/vvia-securities-fts-2026'
import { content as vviaSecuritiesBsi } from './phan-tich-doanh-nghiep/vvia-securities-bsi-2026'
import { content as vviaSecuritiesCts } from './phan-tich-doanh-nghiep/vvia-securities-cts-2026'
import { content as vviaSecuritiesAgr } from './phan-tich-doanh-nghiep/vvia-securities-agr-2026'
import { content as vviaRetailMwg } from './phan-tich-doanh-nghiep/vvia-retail-mwg-2026'
import { content as vviaRetailFrt } from './phan-tich-doanh-nghiep/vvia-retail-frt-2026'
import { content as vviaRetailPnj } from './phan-tich-doanh-nghiep/vvia-retail-pnj-2026'
import { content as vviaRetailDgw } from './phan-tich-doanh-nghiep/vvia-retail-dgw-2026'
import { vviaReVhm2026 as vviaReVhm } from './phan-tich-doanh-nghiep/vvia-re-vhm-2026'
import { vviaReNvl2026 as vviaReNvl } from './phan-tich-doanh-nghiep/vvia-re-nvl-2026'
import { vviaReDig2026 as vviaReDig } from './phan-tich-doanh-nghiep/vvia-re-dig-2026'
import { vviaRePdr2026 as vviaRePdr } from './phan-tich-doanh-nghiep/vvia-re-pdr-2026'
import { vviaReDxg2026 as vviaReDxg } from './phan-tich-doanh-nghiep/vvia-re-dxg-2026'
import { vviaReNlg2026 as vviaReNlg } from './phan-tich-doanh-nghiep/vvia-re-nlg-2026'
import { vviaReKdh2026 as vviaReKdh } from './phan-tich-doanh-nghiep/vvia-re-kdh-2026'

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
    'huyen-thoai-dau-tu/jesse-livermore-stock-operator': jesseLivermoreStockOperator,
    'huyen-thoai-dau-tu/william-oneil-canslim': williamOneilCanslim,
    'huyen-thoai-dau-tu/darvas-box-theory': darvasBoxTheory,
    'huyen-thoai-dau-tu/buffett-the-snowball': buffettTheSnowball,
    
    // Doanh Nghiệp
    'phan-tich-doanh-nghiep/vvia-bank-mbb-2026': vviaBankMbb,
    'phan-tich-doanh-nghiep/vvia-bank-vcb-2026': vviaBankVcb,
    'phan-tich-doanh-nghiep/vvia-bank-tcb-2026': vviaBankTcb,
    'phan-tich-doanh-nghiep/vvia-bank-vpb-2026': vviaBankVpb,
    'phan-tich-doanh-nghiep/vvia-bank-acb-2026': vviaBankAcb,
    'phan-tich-doanh-nghiep/vvia-bank-ctg-2026': vviaBankCtg,
    'phan-tich-doanh-nghiep/vvia-bank-bid-2026': vviaBankBid,
    'phan-tich-doanh-nghiep/vvia-bank-stb-2026': vviaBankStb,
    'phan-tich-doanh-nghiep/vvia-bank-vib-2026': vviaBankVib,
    'phan-tich-doanh-nghiep/vvia-bank-tpb-2026': vviaBankTpb,
    'phan-tich-doanh-nghiep/vvia-bank-hdb-2026': vviaBankHdb,
    'phan-tich-doanh-nghiep/vvia-bank-lpb-2026': vviaBankLpb,
    'phan-tich-doanh-nghiep/vvia-bank-shb-2026': vviaBankShb,
    'phan-tich-doanh-nghiep/vvia-bank-eib-2026': vviaBankEib,
    'phan-tich-doanh-nghiep/vvia-bank-msb-2026': vviaBankMsb,
    'phan-tich-doanh-nghiep/vvia-bank-ocb-2026': vviaBankOcb,
    'phan-tich-doanh-nghiep/vvia-bank-ssb-2026': vviaBankSsb,
    'phan-tich-doanh-nghiep/vvia-bank-nab-2026': vviaBankNab,
    'phan-tich-doanh-nghiep/vvia-bank-abb-2026': vviaBankAbb,
    'phan-tich-doanh-nghiep/vvia-bank-bab-2026': vviaBankBab,
    'phan-tich-doanh-nghiep/vvia-bank-nvb-2026': vviaBankNvb,
    'phan-tich-doanh-nghiep/vvia-bank-klb-2026': vviaBankKlb,
    'phan-tich-doanh-nghiep/vvia-bank-bvb-2026': vviaBankBvb,
    'phan-tich-doanh-nghiep/vvia-bank-pgb-2026': vviaBankPgb,
    'phan-tich-doanh-nghiep/vvia-bank-vab-2026': vviaBankVab,
    'phan-tich-doanh-nghiep/vvia-bank-sgb-2026': vviaBankSgb,
    'phan-tich-doanh-nghiep/vvia-tech-fpt-2026': vviaTechFpt,
    'phan-tich-doanh-nghiep/vvia-steel-hpg-2026': vviaSteelHpg,
    'phan-tich-doanh-nghiep/vvia-securities-ssi-2026': vviaSecuritiesSsi,
    'phan-tich-doanh-nghiep/vvia-securities-vnd-2026': vviaSecuritiesVnd,
    'phan-tich-doanh-nghiep/vvia-securities-vci-2026': vviaSecuritiesVci,
    'phan-tich-doanh-nghiep/vvia-securities-hcm-2026': vviaSecuritiesHcm,
    'phan-tich-doanh-nghiep/vvia-securities-shs-2026': vviaSecuritiesShs,
    'phan-tich-doanh-nghiep/vvia-securities-mbs-2026': vviaSecuritiesMbs,
    'phan-tich-doanh-nghiep/vvia-securities-vix-2026': vviaSecuritiesVix,
    'phan-tich-doanh-nghiep/vvia-securities-fts-2026': vviaSecuritiesFts,
    'phan-tich-doanh-nghiep/vvia-securities-bsi-2026': vviaSecuritiesBsi,
    'phan-tich-doanh-nghiep/vvia-securities-cts-2026': vviaSecuritiesCts,
    'phan-tich-doanh-nghiep/vvia-securities-agr-2026': vviaSecuritiesAgr,
    'phan-tich-doanh-nghiep/vvia-retail-mwg-2026': vviaRetailMwg,
    'phan-tich-doanh-nghiep/vvia-retail-frt-2026': vviaRetailFrt,
    'phan-tich-doanh-nghiep/vvia-retail-pnj-2026': vviaRetailPnj,
    'phan-tich-doanh-nghiep/vvia-retail-dgw-2026': vviaRetailDgw,
    'phan-tich-doanh-nghiep/vvia-re-vhm-2026': vviaReVhm,
    'phan-tich-doanh-nghiep/vvia-re-nvl-2026': vviaReNvl,
    'phan-tich-doanh-nghiep/vvia-re-dig-2026': vviaReDig,
    'phan-tich-doanh-nghiep/vvia-re-pdr-2026': vviaRePdr,
    'phan-tich-doanh-nghiep/vvia-re-dxg-2026': vviaReDxg,
    'phan-tich-doanh-nghiep/vvia-re-nlg-2026': vviaReNlg,
    'phan-tich-doanh-nghiep/vvia-re-kdh-2026': vviaReKdh,
}

export function getArticleContent(pillarSlug: string, articleSlug: string): ContentBlock[] | null {
    return CONTENT_REGISTRY[`${pillarSlug}/${articleSlug}`] ?? null
}
