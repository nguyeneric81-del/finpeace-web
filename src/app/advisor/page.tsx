import React from 'react';
import AdvisorPresentation from './components/AdvisorPresentation';

export const metadata = {
    title: 'Hồ Sơ Năng Lực Tài Chính - FinPeace',
    description: 'Bản đồ Bình An Tài Chính cá nhân hóa',
};

export default async function AdvisorPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>
}) {
    const params = await searchParams;
    return (
        <main className="w-full min-h-screen bg-[#F9FAFB]">
            <AdvisorPresentation initialEmail={params.email} />
        </main>
    );
}
