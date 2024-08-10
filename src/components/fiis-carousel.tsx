'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import { Skeleton as ShadSkeleton } from './ui/skeleton'

const Skeleton = () => {
  return (
    <div className="flex space-x-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <ShadSkeleton
          key={index}
          className={`w-[244px] h-[104px] ${index === 1 && 'shrink-0'}`}
        />
      ))}
    </div>
  )
}

export default function FiisCarousel() {
  const [isEmblaRendered, setIsEmblaRendered] = useState(false)

  useEffect(() => {
    setIsEmblaRendered(true)
  }, [])

  if (!isEmblaRendered) return <Skeleton />

  return (
    <Carousel
      opts={{
        loop: true,
        active: window?.innerWidth < 1130,
      }}
      className="w-full "
    >
      <CarouselContent className="-ml-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CarouselItem key={index} className="pl-4 basis-[260px]">
            <Card className="bg-background border-zinc-800">
              <CardHeader>
                <CardTitle className="text-md font-normal text-white">
                  Total em FIIs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white pt-2 text-lg font-semibold tracking-wide">
                <p>R$25.000,50</p>
              </CardContent>
              <CardContent className="text-white text-[12px] font-thin tracking-wide">
                <p>+6% from initial value</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
