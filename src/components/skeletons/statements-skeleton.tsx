import React from "react";
import { Skeleton as ShadSkeleton } from "../ui/skeleton";
export function StatementsSkeleton() {
  return (
    <main className=" mt-6 max-w-[1024px] mx-auto px-6">
      <ShadSkeleton className="mx-auto w-[130px] h-[30px] lg:mx-0" />
      <div className="lg:flex lg:items-center lg:mt-8 gap-6">
        <div className="flex items-center gap-6 mt-6 lg:mt-0 ">
          <div className="space-y-2">
            <ShadSkeleton className=" w-[80px] h-[25px]" />
            <ShadSkeleton className=" w-[150px] h-[35px]" />
          </div>
          <div className="space-y-2  w-full">
            <ShadSkeleton className=" w-[80px] h-[25px]" />
            <ShadSkeleton className="lg:w-[180px] w-[100%] max-w-[300px] min-w-max h-[35px]" />
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4 lg:mt-0">
          <div className="space-y-2">
            <ShadSkeleton className=" w-[80px] h-[25px]" />
            <ShadSkeleton className="lg:w-[180px] max-w-[300px] w-[150px] h-[35px]" />
          </div>
          <div className="space-y-2 w-full">
            <ShadSkeleton className=" w-[80px] h-[25px]" />
            <ShadSkeleton className="lg:w-[180px] w-[100%] max-w-[300px] min-w-max h-[35px]" />
          </div>
        </div>
      </div>

      <ShadSkeleton className="lg:h-[600px] w-full h-[488px] mt-6 " />
    </main>
  );
}
