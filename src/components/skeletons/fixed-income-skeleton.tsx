import React from "react";
import { Skeleton as ShadSkeleton } from "../ui/skeleton";
export function FixedIncomeSkeleton() {
  return (
    <main className="w-[90%] mx-auto mt-6 overflow-hidden lg:w-[calc(100%-48px)] lg:max-w-[1400px] pb-12">
      <ShadSkeleton className=" w-[130px] h-[30px] lg:mx-0" />
      <ShadSkeleton className=" w-full h-[70px] mt-4 lg:mx-0" />
      <div className="lg:flex lg:items-center lg:mt-8 gap-6 lg:w-full">
        <div className="flex items-baseline gap-6 mt-6 lg:mt-0 lg:justify-between lg:w-full ">
          <div className="space-y-2">
            <ShadSkeleton className=" w-[80px] h-[25px]" />
            <ShadSkeleton className=" w-[150px] h-[45px]" />
          </div>
          <ShadSkeleton className="lg:w-[180px] w-[100%] max-w-[300px] min-w-max h-[35px]" />
        </div>
      </div>

      <div className="lg:flex items-center lg:items-start lg:gap-12">
        <ShadSkeleton className="w-full lg:basis-[60%] h-[300px] mt-6 " />
        <div className="lg:basis-[40%]">
          <ShadSkeleton className="w-full h-[90px] mt-6 " />
          <ShadSkeleton className="w-full h-[90px] mt-6 " />
        </div>
      </div>
    </main>
  );
}
