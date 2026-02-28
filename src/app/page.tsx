import { redirect } from "next/navigation"

export default function Home() {
  // Redirect trực tiếp về dashboard, hệ thống middleware sẽ tự chèn và đẩy về /login nếu chưa đăng nhập.
  redirect("/dashboard")
}
