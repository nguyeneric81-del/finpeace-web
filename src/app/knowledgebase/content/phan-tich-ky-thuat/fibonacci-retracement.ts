// Article content for: phan-tich-ky-thuat / fibonacci-retracement
// Fibonacci Retracement — Tỷ Lệ Vàng Trong Biến Động Giá

import type { ContentBlock } from '../../data'

export const content: ContentBlock[] = [
    {
        type: 'intro',
        content: `Vào thế kỷ 13, nhà toán học Leonardo Fibonacci đã giới thiệu một dãy số kỳ diệu: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...

Mỗi số là tổng của hai số trước. Và điều kỳ lạ: tỷ lệ giữa các số liên tiếp hội tụ về 1.618 — gọi là "Tỷ Lệ Vàng" (Golden Ratio), xuất hiện khắp nơi trong tự nhiên: cánh hoa hướng dương, vỏ ốc nautilus, tỷ lệ cơ thể người.

Liệu tỷ lệ vàng có ứng dụng trong thị trường tài chính không? Hàng triệu trader trên thế giới tin là có — và trong nhiều trường hợp, Fibonacci Retracement hoạt động như "lời tiên tri tự thực hiện": vì quá nhiều người dùng nó, giá thật sự có xu hướng dừng lại ở các mức Fibonacci.`,
    },
    {
        type: 'key-insight',
        title: '💡 Các Mức Fibonacci Retracement Quan Trọng',
        content: 'Từ dãy Fibonacci, các tỷ lệ retracement chính được tính ra: 23.6%, 38.2%, 50%, 61.8%, 78.6%. Quan trọng nhất là 38.2%, 50%, và 61.8% (còn gọi là "Golden Ratio"). Thị trường hay "hồi" (retrace) về các mức này trong xu hướng chính trước khi tiếp tục.',
    },
    {
        type: 'steps',
        title: '📏 Cách Vẽ Fibonacci Retracement Đúng Cách',
        content: 'Quy trình chuẩn để vẽ và sử dụng Fibonacci:',
        items: [
            {
                icon: '1️⃣',
                title: 'Xác Định Xu Hướng Rõ Ràng',
                body: 'Fibonacci chỉ hiệu quả khi có xu hướng rõ ràng (uptrend hoặc downtrend). Trong sideway market, không dùng Fibonacci. Xác định đỉnh (swing high) và đáy (swing low) gần nhất.',
                highlight: 'Quan trọng: vẽ từ đáy lên đỉnh (uptrend) hoặc từ đỉnh xuống đáy (downtrend)',
            },
            {
                icon: '2️⃣',
                title: 'Vẽ Fibonacci Trong Uptrend',
                body: 'Kéo từ swing low (đáy) → swing high (đỉnh mới nhất). Các mức Fibonacci xuất hiện dưới đỉnh: 23.6%, 38.2%, 50%, 61.8%, 78.6%. Đây là các vùng giá có thể "hồi" về trước khi tăng tiếp.',
                highlight: 'Best practice: tìm entry mua ở vùng 38.2-61.8% khi uptrend mạnh',
            },
            {
                icon: '3️⃣',
                title: 'Vẽ Fibonacci Trong Downtrend',
                body: 'Kéo từ swing high (đỉnh) → swing low (đáy mới nhất). Các mức Fibonacci xuất hiện trên đáy. Đây là các vùng resistance — nơi giá có thể hồi lên rồi lại giảm tiếp.',
                highlight: 'Best practice: tìm entry bán/short ở vùng 38.2-61.8% trong downtrend',
            },
            {
                icon: '4️⃣',
                title: 'Xác Nhận Bằng Công Cụ Khác',
                body: 'Fibonacci mạnh nhất khi mức retracement trùng với: Support/Resistance cũ, MA20 hoặc MA50, Vùng nến Hammer/Doji, Oversold RSI (< 40). Sự hội tụ nhiều công cụ = "confluence zone" = độ tin cậy cao hơn nhiều.',
                highlight: 'Golden rule: Fibonacci + S/R + Volume spike = entry chất lượng cao',
            },
        ],
    },
    {
        type: 'quote',
        content: '"Fibonacci không phải là phép màu. Nó hoạt động vì đủ nhiều trader tin vào nó và giao dịch theo nó. Đó là lý do bạn cần biết nó — không phải vì toán học, mà vì tâm lý đám đông."',
        author: 'John Murphy',
        source: 'Technical Analysis of the Financial Markets',
    },
    {
        type: 'concept',
        title: '🎯 Fibonacci Extension — Tìm Mục Tiêu Giá',
        content: `Bên cạnh Retracement (tìm vùng hỗ trợ khi giá hồi), Fibonacci Extension giúp tìm mục tiêu giá khi giá phá vỡ và tiếp tục xu hướng.

Các mức Extension phổ biến: 127.2%, 161.8%, 200%, 261.8%

**Ví dụ thực tế:**
- VHC đang uptrend từ 60k lên 80k (swing của 20k)
- Giá hồi về 38.2% Fib (~72.4k) và bật lên
- Target 1: 127.2% extension = 80k + (20k × 0.272) = 85.4k
- Target 2: 161.8% extension = 80k + (20k × 0.618) = 92.4k

Extension đặc biệt hữu ích khi giá đang ở vùng giá mới (all-time high) và không có resistance cũ để tham chiếu.`,
    },
    {
        type: 'checklist',
        title: '✅ Fibonacci Checklist Trước Khi Vào Lệnh',
        content: [
            'Xu hướng rõ ràng trên khung H4 hoặc Daily? (Fibonacci yếu trong sideway)',
            'Đã xác định đúng swing high và swing low gần nhất chưa?',
            'Mức Fibonacci có trùng với support/resistance cũ không? (confluece zone = tốt hơn)',
            'Volume có giảm trong đợt hồi và tăng khi giá bật không? (xác nhận phe mua còn mạnh)',
            'RSI ở vùng oversold/overbought tại mức Fibonacci không? (tín hiệu thêm)',
            'Stop loss đã đặt phía sau mức Fibonacci tiếp theo chưa? (ví dụ: mua ở 50%, SL dưới 61.8%)',
        ],
    },
    {
        type: 'warning',
        title: '⚠️ Fibonacci Là Công Cụ, Không Phải Thánh Chỉ',
        content: 'Không có mức Fibonacci nào "đảm bảo" giá sẽ dừng tại đó. Thị trường thường test qua khỏi mức Fibonacci vài điểm phần trăm trước khi bật lại — gọi là "wick through" hoặc "shake out". Đặt stop loss đủ rộng để tránh bị stop loss oan bởi noise. Và quan trọng nhất: không giao dịch chỉ dựa vào Fibonacci — luôn kết hợp với ít nhất 1-2 công cụ xác nhận khác.',
    },
    {
        type: 'summary',
        title: '📋 Ghi Nhớ Sau Bài Này',
        content: [
            'Fibonacci Retracement: vẽ từ swing high → swing low (hoặc ngược lại) để tìm vùng support/resistance tiềm năng',
            '3 mức quan trọng nhất: 38.2%, 50%, 61.8% (Golden Ratio)',
            'Confluence zone: Fib level + S/R cũ + MA + Volume spike = entry chất lượng cao nhất',
            'Fibonacci Extension: tìm target price sau breakout (127.2%, 161.8%, 261.8%)',
            'Không dùng Fibonacci đơn độc — luôn kết hợp xác nhận từ volume và công cụ khác',
        ],
    },
]
