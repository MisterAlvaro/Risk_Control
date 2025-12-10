import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { accountsApi } from '@/lib/api/endpoints'
import { getRiskLevelColor } from '@/lib/utils/formatters'

interface PageProps {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const accountId = Number(params.id)

  let riskData: Awaited<ReturnType<typeof accountsApi.getRiskStatus>> | null = null
  try {
    riskData = await accountsApi.getRiskStatus(accountId)
  } catch (error) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-2xl font-semibold">Riesgo de la cuenta</h1>
        <p className="text-muted-foreground">Cuenta: {accountId}</p>
        <p className="text-red-600">No se pudo cargar el estado de riesgo.</p>
      </div>
    )
  }

  const account = riskData?.account
  const riskStatus = riskData?.risk_status

  if (!riskStatus || !account) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-2xl font-semibold">Riesgo de la cuenta</h1>
        <p className="text-muted-foreground">Cuenta: {accountId}</p>
        <p className="text-muted-foreground">No hay datos de riesgo disponibles.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Riesgo de la cuenta</h1>
          <p className="text-muted-foreground">
            Cuenta: {account.login ?? accountId}
          </p>
        </div>
        <Badge className={getRiskLevelColor(riskStatus.risk_level)}>
          {riskStatus.risk_level === 'critical'
            ? 'Crítico'
            : riskStatus.risk_level === 'high'
              ? 'Alto'
              : riskStatus.risk_level === 'medium'
                ? 'Medio'
                : 'Bajo'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Incidentes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{riskStatus.total_incidents}</p>
            <p className="text-sm text-muted-foreground">Histórico registrado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incidentes activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{riskStatus.active_incidents}</p>
            <p className="text-sm text-muted-foreground">Pendientes de cierre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trading habilitado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {riskStatus.trading_enabled ? 'Sí' : 'No'}
            </p>
            <p className="text-sm text-muted-foreground">Estado actual</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reglas con violaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {riskStatus.rule_status.filter((r) => r.is_violated).length === 0 && (
            <p className="text-muted-foreground">Sin reglas violadas.</p>
          )}
          {riskStatus.rule_status
            .filter((r) => r.is_violated)
            .map((rule) => (
              <div
                key={rule.rule_id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-semibold">{rule.rule_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {rule.rule_type} • {rule.severity}
                  </p>
                </div>
                <Badge variant="destructive">
                  {rule.incidents_count} incidentes
                </Badge>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
