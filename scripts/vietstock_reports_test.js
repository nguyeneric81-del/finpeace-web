const fs = require('fs');
const path = require('path');
const http = require('http'); // The URLs are http://static1.vietstock.vn
const cookieString = process.env.VIETSTOCK_COOKIE || '';

async function testFetchReports() {
    console.log("🚀 Bắt đầu lấy URL Báo cáo...");
    try {
        const body = new URLSearchParams({
            'type': '2',
            '__RequestVerificationToken': 'fplFqxr90mfAUfdO2LRKpsHLODIB6bqbiOtcdfI8MD2VA9Pq0K57y55twIc4GrruxeC-UpCeVzh-zONnaLIppf_lWSbgD_UdPtjHyq5YyYr1mamSsy_dLYfczZaMLnIo7Bj6y6Tf345mB4Wp-0t2GA2'
        });

        const apiRes = await fetch("https://finance.vietstock.vn/Data/GetEDocumentPage", {
            method: "POST",
            headers: {
                "Cookie": cookieString,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0"
            },
            body: body.toString()
        });
        
        const data = await apiRes.json();
        console.log(`Tìm thấy ${data.length} báo cáo. Tải thử 3 báo cáo đầu tiên...`);

        const outDir = path.join(__dirname, '../../finpeace-reports');
        
        for (let i = 0; i < Math.min(3, data.length); i++) {
            const report = data[i];
            if (!report.Url) continue;
            
            let rawName = report.Title.replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/gi, '_');
            rawName = rawName.substring(0, 100); // truncate if too long
            const fileName = `[${report.SourceName}]_${rawName}.pdf`;
            const dest = path.join(outDir, fileName);
            
            console.log(`-> Đang tải: ${fileName}`);
            
            const file = fs.createWriteStream(dest);
            await new Promise((resolve, reject) => {
                http.get(report.Url, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log(`✅ Xong: ${fileName}`);
                        resolve();
                    });
                }).on('error', (err) => {
                    fs.unlink(dest, () => {});
                    console.error(`❌ Lỗi tải ${fileName}:`, err);
                    resolve(); // continue anyway
                });
            });
        }
        console.log("🎉 KIỂM TRA MỤC finpeace-reports ĐỂ XEM FILE!");
    } catch (err) {
        console.error("Error:", err);
    }
}
testFetchReports();
