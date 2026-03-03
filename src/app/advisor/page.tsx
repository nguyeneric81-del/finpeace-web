import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function AdvisorIndexPage() {
    // Kiểm tra cookie để redirect đúng
    const cookieStore = await cookies()
    const token = cookieStore.get('advisor_token')

    if (token) {
        redirect('/advisor/dashboard')
    } else {
        redirect('/advisor/register')
    }
}
