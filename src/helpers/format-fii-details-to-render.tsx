import CalendarArrowDown from '@/components/calendar-arrow-down'
import { FiiSummary } from '@/types/fiis'

export const formatPvpAndYieldToRender = (fii: FiiSummary) => {
  const pvp = fii?.pvp ? fii?.pvp : (fii?.extraInfo?.pvp ?? undefined)
  const monthlyYield = fii?.monthlyYield
    ? fii?.monthlyYield
    : (fii?.extraInfo?.monthlyYield ?? undefined)

  return {
    pvp: (
      <div>
        <p>{pvp ?? 'N/A'}</p>
        {!fii?.pvp && fii.extraInfo?.pvp && (
          <div className="flex gap-2 items-center">
            <CalendarArrowDown />
            <p className="pt-[2px]">{fii?.extraInfo?.pvp?.toFixed(2)}</p>
          </div>
        )}
      </div>
    ),
    monthlyYield: (
      <div>
        <p>{monthlyYield ?? 'N/A'}</p>
        {!fii?.monthlyYield && fii.extraInfo?.monthlyYield && (
          <div className="flex gap-2 items-center">
            <CalendarArrowDown />
            <p className="pt-[2px]">
              {(fii?.extraInfo?.monthlyYield * 100)?.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    ),
  }
}
