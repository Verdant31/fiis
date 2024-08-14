export const run = async (model: string, input: Record<never, never>) => {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/1c426d50541058e8d868c752c427635d/ai/run/${model}`,
    {
      headers: {
        Authorization: 'Bearer _QgcfSdSbIhfamrbKZ2VTSJw1hJP0Pc35ak0gvqH',
      },
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
  const result = await response.json()
  return result
}
