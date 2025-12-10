import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (dateString: string, formatStr = 'PPpp') => {
  try {
    return format(parseISO(dateString), formatStr, { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

export const formatRelativeTime = (dateString: string) => {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: es });
  } catch {
    return '';
  }
};

export const formatNumber = (num: number, decimals = 2) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(amount);
};

export const formatRuleType = (type: string): string => {
  const types: Record<string, string> = {
    duration: 'Duración de Trade',
    volume_consistency: 'Consistencia de Volumen',
    open_trades_count: 'Cantidad de Trades Abiertos',
  };
  return types[type] || type;
};

export const formatSeverity = (severity: string): string => {
  return severity === 'hard' ? 'Crítica' : 'Advertencia';
};

export const formatActionType = (type: string): string => {
  const types: Record<string, string> = {
    email: 'Email',
    slack: 'Slack',
    disable_trading: 'Deshabilitar Trading',
    disable_account: 'Deshabilitar Cuenta',
  };
  return types[type] || type;
};

export const getRiskLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processed: 'bg-blue-100 text-blue-800 border-blue-200',
    action_executed: 'bg-red-100 text-red-800 border-red-200',
    enable: 'bg-green-100 text-green-800 border-green-200',
    disable: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const formatTradeDuration = (seconds: number | null): string => {
  if (seconds === null) return 'N/A';
  
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
};