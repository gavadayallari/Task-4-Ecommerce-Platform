import React from 'react';
import { Clock, RefreshCw, Truck, CheckCircle2, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
  const configs = {
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock
    },
    Processing: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: RefreshCw
    },
    Shipped: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Truck
    },
    Delivered: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2
    },
    Cancelled: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle
    }
  };

  const config = configs[status] || configs.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default OrderStatusBadge;
