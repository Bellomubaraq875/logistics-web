import { STATUS_LABEL } from '@/lib/api';

const COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700', ACCEPTED: 'bg-blue-100 text-blue-700', PICKED_UP: 'bg-indigo-100 text-indigo-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-800', DELIVERED: 'bg-emerald-100 text-emerald-800',
  FAILED: 'bg-red-100 text-red-700', RETURNED: 'bg-orange-100 text-orange-700',
  APPROVED: 'bg-emerald-100 text-emerald-800', REJECTED: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[status] || 'bg-gray-100'}`}>
      {STATUS_LABEL[status] || status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
