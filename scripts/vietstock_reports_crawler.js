const fs = require('fs');
const path = require('path');

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;
const now = Date.now();

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const protocol = url.startsWith('https') ? require('https') : require('http');
        protocol.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            console.error(`❌ Lỗi tải file:`, err);
            resolve(false);
        });
    });
}

async function crawlReports() {
    console.log("🚀 Bắt đầu quét Báo cáo Vĩ mô & Ngành (3 tháng gần đây)...");
    
    // ── Get dynamic cookies and verification token ──
    console.log("📡 Đang lấy cookie và token xác thực từ VietStock...");
    let cookieHeader = "";
    let token = "";
    try {
        const res = await fetch("https://finance.vietstock.vn/");
        const html = await res.text();
        const cookies = res.headers.getSetCookie();
        
        let aspSession = "";
        let requestTokenCookie = "";
        for (const c of cookies) {
            if (c.includes("ASP.NET_SessionId")) aspSession = c.split(";")[0];
            if (c.includes("__RequestVerificationToken")) requestTokenCookie = c.split(";")[0];
        }
        
        const match = html.match(/name="?__RequestVerificationToken"?\s+type="?hidden"?\s+value="?([A-Za-z0-9_-]+)"?/i);
        if (!match) throw new Error("Không tìm thấy token trong HTML");
        
        token = match[1];
        cookieHeader = `${aspSession}; ${requestTokenCookie}; language=vi-VN`;
        console.log("✅ Lấy cookie và token thành công!");
    } catch (e) {
        console.error("❌ Lỗi lấy cookie và token:", e.message);
        return;
    }

    const outDir = path.join(__dirname, '../../finpeace-reports');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    let page = 1;
    let hasMore = true;
    let totalDownloaded = 0;

    while (hasMore) {
        console.log(`\n--- Đang quét Trang ${page} ---`);
        try {
            const body = new URLSearchParams({
                'type': '2',
                'page': page.toString(),
                'pageSize': '20',
                '__RequestVerificationToken': token
            });

            const apiRes = await fetch("https://finance.vietstock.vn/Data/GetEDocumentPage", {
                method: "POST",
                headers: {
                    "Cookie": cookieHeader,
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "User-Agent": "Mozilla/5.0"
                },
                body: body.toString()
            });
            
            const data = await apiRes.json();
            if (!data || data.length === 0) {
                console.log("Đã hết dữ liệu báo cáo.");
                break;
            }
            
            let validItemsInPage = 0;
            let oldItemsInPage = 0;

            for (const report of data) {
                // Extract date
                const match = report.PublishDate.match(/\/Date\((\d+)\)\//);
                if (!match) continue;
                
                const reportTime = parseInt(match[1]);
                const reportDateStr = new Date(reportTime).toLocaleDateString('vi-VN');
                
                // Check if older than 3 months
                if (now - reportTime > THREE_MONTHS_MS) {
                    oldItemsInPage++;
                    continue;
                }
                
                // Filter by type: NOT Phân tích Doanh nghiệp
                const isExempt = report.TypeName.includes('Doanh nghiệp') || report.ReportTypeID === 58;
                if (isExempt) continue;
                
                // Valid record
                validItemsInPage++;
                
                // Prepare filename
                let rawName = `${report.TypeName}_${report.Title}`.replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/gi, '_');
                rawName = rawName.substring(0, 100).trim();
                const fileName = `[${report.SourceName}]_${reportDateStr.replace(/\//g, '-')} - ${rawName}.pdf`;
                const dest = path.join(outDir, fileName);
                
                if (!fs.existsSync(dest) && report.Url) {
                    console.log(`-> Tìm thấy: ${fileName}`);
                    const success = await downloadFile(report.Url, dest);
                    if (success) {
                        console.log(`   ✅ Tải thành công!`);
                        totalDownloaded++;
                    }
                } else if (fs.existsSync(dest)) {
                    console.log(`-> File đã có sẵn, bỏ qua: ${fileName}`);
                }
            }
            
            // Stop if all items in page are older than 3 months (considering chronological order API)
            if (oldItemsInPage === data.length) {
                console.log("\n🛑 Đã chạm đến mốc thời gian cũ hơn 3 tháng. Ngưng quét.");
                hasMore = false;
            } else {
                page++;
            }
        } catch (err) {
            console.error("Lỗi khi quét báo cáo:", err);
            hasMore = false;
        }
    }
    
    console.log(`\n🎉 HOÀN TẤT CHIẾN DỊCH! Tổng cộng đã bế về: ${totalDownloaded} báo cáo Vĩ mô & Ngành.`);
}

crawlReports();
