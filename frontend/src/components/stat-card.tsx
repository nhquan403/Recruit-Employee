interface StatCardProps {
  label: string;
  value: number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex min-w-[140px] flex-col gap-1 rounded-lg border border-border bg-white p-4">
      <span className="text-2xl font-bold text-primary">{value.toLocaleString('vi-VN')}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
