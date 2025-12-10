export const RULE_TYPES = [
    { value: 'duration', label: 'Duración de Trade', description: 'Detecta trades cerrados demasiado rápido' },
    { value: 'volume_consistency', label: 'Consistencia de Volumen', description: 'Detecta volúmenes anormales comparados con el histórico' },
    { value: 'open_trades_count', label: 'Cantidad de Trades Abiertos', description: 'Limita la cantidad de trades abiertos concurrentes' },
  ];
  
  export const SEVERITY_TYPES = [
    { value: 'hard', label: 'Crítica', description: 'Acción inmediata al detectar violación' },
    { value: 'soft', label: 'Advertencia', description: 'Acción después de múltiples violaciones' },
  ];
  
  export const ACTION_TYPES = [
    { value: 'email', label: 'Email', description: 'Enviar notificación por email' },
    { value: 'slack', label: 'Slack', description: 'Enviar notificación a Slack' },
    { value: 'disable_trading', label: 'Deshabilitar Trading', description: 'Deshabilitar trading de la cuenta' },
    { value: 'disable_account', label: 'Deshabilitar Cuenta', description: 'Deshabilitar completamente la cuenta' },
  ];
  
  export const INCIDENT_STATUS = [
    { value: 'pending', label: 'Pendiente', color: 'yellow' },
    { value: 'processed', label: 'Procesado', color: 'blue' },
    { value: 'action_executed', label: 'Acción Ejecutada', color: 'red' },
  ];
  
  export const ACCOUNT_STATUS = [
    { value: 'enable', label: 'Habilitada', color: 'green' },
    { value: 'disable', label: 'Deshabilitada', color: 'red' },
  ];
  
  export const TRADE_STATUS = [
    { value: 'open', label: 'Abierto', color: 'blue' },
    { value: 'closed', label: 'Cerrado', color: 'green' },
  ];
  
  export const TRADE_TYPES = [
    { value: 'BUY', label: 'Compra', color: 'green' },
    { value: 'SELL', label: 'Venta', color: 'red' },
  ];