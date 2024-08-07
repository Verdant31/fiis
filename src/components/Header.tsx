'use client'
import { Cardholder } from 'phosphor-react'
import { FiiWallet } from './fiis/FiiWallet'
import { InsertFiiModal } from './fiis/InsertFiiModal'
import { ReloadFiisModal } from './fiis/ReloadFiisModal'

export default function Header() {
  return (
    <div className="flex w-[100vw] items-center mb-2 border-b-[1px] pb-[14px] mt-4">
      <div className="w-[1500px] m-auto pl-5 flex gap-8">
        <div className="flex items-center gap-[8px] mr-8">
          <Cardholder size={24} />
          <h1 className="font-bold text-xl">MYFIIS</h1>
        </div>
        <a
          href="/"
          className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400"
        >
          Home
        </a>
        <InsertFiiModal />
        <ReloadFiisModal />
        <FiiWallet />
        <a
          href="/payments"
          className="cursor-pointer text-lg w-[90px] text-center tracking-wider text-zinc-400"
        >
          Payments
        </a>
      </div>
    </div>
  )
}
