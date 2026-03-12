const fs = require('fs');
const cookieString = process.env.VIETSTOCK_COOKIE || '';

async function testFetch() {
    console.log("🚀 Hacking API GetReportDataByIDs with provided Payload...");
    try {
        const body = new URLSearchParams({
            'termTypeID': '3',
            'subTermTypeID': '',
            'fromDate': '2021-03-12',
            'toDate': '2026-03-12',
            'type': 'CATEGORY',
            'listID[]': '74',
            '__RequestVerificationToken': 'fplFqxr90mfAUfdO2LRKpsHLODIB6bqbiOtcdfI8MD2VA9Pq0K57y55twIc4GrruxeC-UpCeVzh-zONnaLIppf_lWSbgD_UdPtjHyq5YyYr1mamSsy_dLYfczZaMLnIo7Bj6y6Tf345mB4Wp-0t2GA2'
        });

        const apiRes = await fetch("https://finance.vietstock.vn/Macro/GetReportDataByIDs", {
            method: "POST",
            headers: {
                "Cookie": cookieString,
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
                "Accept": "*/*"
            },
            body: body.toString()
        });
        
        const text = await apiRes.text();
        console.log("Status:", apiRes.status);
        console.log("Preview Response:", text.substring(0, 500));
    } catch (err) {
        console.error("Error:", err);
    }
}
testFetch();
