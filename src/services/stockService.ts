/**
 * Stock quote & symbol search service using Yahoo Finance API.
 *
 * No API key required. Uses the public Yahoo Finance v8/v1 endpoints.
 */

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export interface SymbolSearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
}

/* ─── Quote ───────────────────────────────────────────────── */

interface YahooChartMeta {
  symbol: string
  regularMarketPrice: number
  chartPreviousClose: number
}

interface YahooChartResponse {
  chart: {
    result: { meta: YahooChartMeta }[] | null
    error: { description: string } | null
  }
}

export async function fetchQuote(symbol: string): Promise<StockQuote> {
  const url = `/api/yahoo-chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Yahoo Finance request failed: ${res.status}`)
  }

  const data = (await res.json()) as YahooChartResponse

  if (data.chart.error) {
    throw new Error(data.chart.error.description)
  }

  const result = data.chart.result?.[0]
  if (!result) {
    throw new Error(`No quote data found for "${symbol}"`)
  }

  const { regularMarketPrice, chartPreviousClose } = result.meta
  const change = regularMarketPrice - chartPreviousClose
  const changePercent =
    chartPreviousClose !== 0 ? (change / chartPreviousClose) * 100 : 0

  return {
    symbol: result.meta.symbol,
    price: regularMarketPrice,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  }
}

/* ─── Symbol search ───────────────────────────────────────── */

interface YahooSearchQuote {
  symbol: string
  shortname?: string
  longname?: string
  exchDisp?: string
  typeDisp?: string
  quoteType?: string
}

interface YahooSearchResponse {
  quotes: YahooSearchQuote[]
}

export async function searchSymbols(
  query: string
): Promise<SymbolSearchResult[]> {
  if (!query.trim()) return []

  const url = `/api/yahoo-search?q=${encodeURIComponent(query)}&quotesCount=6&newsCount=0`
  const res = await fetch(url)
  if (!res.ok) return []

  const data = (await res.json()) as YahooSearchResponse
  return (data.quotes ?? [])
    .filter(
      (q) =>
        q.quoteType === 'EQUITY' ||
        q.quoteType === 'ETF' ||
        q.quoteType === 'MUTUALFUND'
    )
    .map((q) => ({
      symbol: q.symbol,
      name: q.longname ?? q.shortname ?? q.symbol,
      exchange: q.exchDisp ?? '',
      type: q.typeDisp ?? q.quoteType ?? '',
    }))
}
