async function fetchTcbs() {
    const res = await fetch('https://apipubaws.tcbs.com.vn/tcanalysis/v1/finance/FPT?yearly=0&isAll=false');
    const data = await res.json();
    console.log("Finance Data:", data.slice(0,1));
    
    const res2 = await fetch('https://apipubaws.tcbs.com.vn/tcanalysis/v1/ticker/FPT/overview');
    const data2 = await res2.json();
    console.log("Overview Data:", data2);
}
fetchTcbs();
