import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { accountsApi } from '@/lib/api/endpoints'
import { formatDate } from '@/lib/utils/formatters'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const accountId = Number(params.id)

  let tradesData: Awaited<ReturnType<typeof accountsApi.getTrades>> | null = null
  try {
    tradesData = await accountsApi.getTrades(accountId, 1)
  } catch (error) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-2xl font-semibold">Trades de la cuenta</h1>
        <p className="text-muted-foreground">Cuenta: {accountId}</p>
        <p className="text-red-600">No se pudo cargar el historial de trades.</p>
      </div>
    )
  }

  const trades = tradesData?.data || []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Trades de la cuenta</h1>
        <p className="text-muted-foreground">Cuenta: {accountId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimos trades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trades.length === 0 && (
            <p className="text-muted-foreground">No hay trades registrados.</p>
          )}

          {trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <p className="font-semibold">
                  #{trade.id} • {trade.type} • {trade.volume} lots
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(trade.open_time, 'dd/MM/yy HH:mm')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={trade.type === 'BUY' ? 'default' : 'outline'}>
                  {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                </Badge>
                <Badge>
                  {trade.status === 'open' ? 'Abierto' : 'Cerrado'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
