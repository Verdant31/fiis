'use client'
import { getArticles } from '@/queries/get-articles'
import { useQuery } from '@tanstack/react-query'
import { CandlestickChart } from 'lucide-react'
import { Skeleton as ShadSkeleton } from './ui/skeleton'

const Skeleton = () => {
  return (
    <div className="mt-6 max-w-[760px] mb-12 lg:max-w-7xl">
      <div className="flex items-end justify-between">
        <div className="w-full">
          <ShadSkeleton className="w-[137px] h-[27px]" />
          <ShadSkeleton className="w-[70%] lg:w-[400px] mt-2 h-[27px]" />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-2">
        <div className="mt-4 flex w-full h-20">
          <ShadSkeleton className="h-20 w-20 rounded-lg shrink-0" />
          <div className="w-full pl-4 ">
            <ShadSkeleton className="h-6 w-[90%]" />
            <ShadSkeleton className="h-6 w-[30%] mt-2" />
          </div>
        </div>
        <div className="mt-4 flex w-full h-20">
          <ShadSkeleton className="h-20 w-20 rounded-lg shrink-0" />
          <div className="w-full pl-4 ">
            <ShadSkeleton className="h-6 w-[90%]" />
            <ShadSkeleton className="h-6 w-[30%] mt-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Articles() {
  const { data: articles, isLoading } = useQuery(
    ['get-articles'],
    async () => await getArticles(),
  )
  if (isLoading) return <Skeleton />
  if (articles?.length === 0 || !articles) return null

  return (
    <div className="mb-12">
      <div className="mt-4 lg:mt-6">
        <h1 className="font-semibold text-lg lg:text-xl">Notícias</h1>
        <p className="text-muted-foreground w-[85%] text-sm lg:text-base">
          Confira as noticias sobre empresas como NVIDIA, Tesla e Amazon
        </p>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:gap-2">
        {articles &&
          articles.map((article) => {
            const thumb = article?.thumbnail?.resolutions?.at(-1)?.url
            return (
              <div key={article.uuid} className="mt-4 gap-4 items-start flex">
                {thumb ? (
                  <img
                    className="h-20 w-20 rounded-md"
                    src={thumb}
                    alt="News"
                  />
                ) : (
                  <div>
                    <CandlestickChart size={80} strokeWidth={1} />
                  </div>
                )}
                <div className="flex flex-col gap-2 lg:gap-0 justify-between">
                  <a
                    href={article.link}
                    target="_blank"
                    className="cursor-pointer overflow-hidden text-ellipsis line-clamp-2 underline font-semibold"
                    rel="noreferrer"
                  >
                    {article.title}
                  </a>
                  <span className="text-muted-foreground">
                    {article.publisher}
                  </span>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
