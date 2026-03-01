'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const router = useRouter()
    const resolvedParams = use(searchParams);
    const message = resolvedParams?.message as string | undefined;

    useEffect(() => {
        // Fallback Client-side Redirect: Nếu là Subdomain Advisor thì đẩy ngược về luồng Advisor
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'advisor.finpeace.cloud' || window.location.hostname.startsWith('advisor.localhost')) {
                router.replace('/advisor')
            }
        }
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-zinc-950">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <Tabs defaultValue="login" className="w-[100%]">
                    <CardHeader className="text-center space-y-2 pb-2">
                        <CardTitle className="text-3xl font-bold tracking-tight text-primary">FinPeace</CardTitle>
                        <CardDescription className="text-sm pb-2">
                            Nền tảng Quản lý tài chính cá nhân
                        </CardDescription>
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-lg p-1">
                            <TabsTrigger value="login" className="rounded-md">Đăng nhập</TabsTrigger>
                            <TabsTrigger value="signup" className="rounded-md">Tạo tài khoản</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    {message && (
                        <div className="px-6 pb-2 text-center text-sm font-medium text-destructive">
                            {message}
                        </div>
                    )}

                    <TabsContent value="login">
                        <form action={login}>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-login">Email</Label>
                                    <Input id="email-login" name="email" type="email" placeholder="congdan@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-login">Mật khẩu</Label>
                                    <Input id="password-login" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Đăng nhập</Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form action={signup}>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullname">Họ và Tên</Label>
                                    <Input id="fullname" name="full_name" type="text" placeholder="Nguyễn Văn A" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-signup">Email</Label>
                                    <Input id="email-signup" name="email" type="email" placeholder="congdan@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-signup">Mật khẩu</Label>
                                    <Input id="password-signup" name="password" type="password" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Tạo tài khoản miễn phí</Button>
                            </CardFooter>
                        </form>
                    </TabsContent>

                </Tabs>
            </Card>
        </div>
    )
}
