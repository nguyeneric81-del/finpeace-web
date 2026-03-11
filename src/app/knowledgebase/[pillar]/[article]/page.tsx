import type { Metadata } from 'next'
import { getPillarBySlug, getArticleBySlug } from '../../data'
import ArticlePageClient from './ArticlePageClient'
import { notFound } from 'next/navigation'

export async function generateMetadata(
    { params }: { params: Promise<{ pillar: string; article: string }> }
): Promise<Metadata> {
    const { pillar: pillarSlug, article: articleSlug } = await params
    const pillar = getPillarBySlug(pillarSlug)
    const article = pillar ? getArticleBySlug(pillarSlug, articleSlug) : undefined

    if (!pillar || !article) return { title: 'Không tìm thấy | FinPeace' }

    const title = `${article.title} | ${pillar.title} — FinPeace`
    const description = article.summary
    const url = `https://finpeace.cloud/knowledgebase/${pillarSlug}/${articleSlug}`
    const keywords = article.tags.join(', ')
    const ogImageUrl = `https://finpeace.cloud/api/og?pillar=${pillarSlug}&title=${encodeURIComponent(article.title)}&description=${encodeURIComponent(article.summary)}`

    // JSON-LD: Article + BreadcrumbList
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                headline: article.title,
                description: article.summary,
                url,
                author: { '@type': 'Organization', name: 'FinPeace', url: 'https://finpeace.cloud' },
                publisher: {
                    '@type': 'Organization',
                    name: 'FinPeace',
                    url: 'https://finpeace.cloud',
                    logo: { '@type': 'ImageObject', url: 'https://finpeace.cloud/logo.png' },
                },
                inLanguage: 'vi',
                keywords,
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Thư Viện Kiến Thức', item: 'https://finpeace.cloud/knowledgebase' },
                    { '@type': 'ListItem', position: 2, name: pillar.title, item: `https://finpeace.cloud/knowledgebase/${pillarSlug}` },
                    { '@type': 'ListItem', position: 3, name: article.title, item: url },
                ],
            },
        ],
    }

    return {
        title,
        description,
        keywords,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'article',
            siteName: 'FinPeace',
            locale: 'vi_VN',
            tags: article.tags,
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        },
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ pillar: string; article: string }> }) {
    const { pillar: pillarSlug, article: articleSlug } = await params
    const pillar = getPillarBySlug(pillarSlug)
    const article = pillar ? getArticleBySlug(pillarSlug, articleSlug) : undefined

    if (!pillar || !article) notFound()

    const articleIndex = pillar.articles.findIndex(a => a.slug === articleSlug)
    const prevArticle = articleIndex > 0 ? pillar.articles[articleIndex - 1] : null
    const nextArticle = articleIndex < pillar.articles.length - 1 ? pillar.articles[articleIndex + 1] : null

    return (
        <ArticlePageClient
            pillar={pillar}
            article={article}
            pillarSlug={pillarSlug}
            articleSlug={articleSlug}
            prevArticle={prevArticle}
            nextArticle={nextArticle}
        />
    )
}
