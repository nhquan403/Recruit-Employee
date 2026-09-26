import Link from 'next/link';
import { FilterBar } from '@/components/filter-bar';
import { JobCard } from '@/components/job-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Job } from '@/lib/job-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface JobsResponse {
  items: Job[];
  total: number;
  page: number;
  limit: number;
}

async function fetchJobs(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string' && value) params.set(key, value);
  }

  const res = await fetch(`${API_URL}/jobs?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    return { items: [], total: 0, page: 1, limit: 10 } satisfies JobsResponse;
  }
  return (await res.json()) as JobsResponse;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const { items, total, page, limit } = await fetchJobs(resolvedSearchParams);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (typeof value === 'string' && value) params.set(key, value);
    }
    params.set('page', String(targetPage));
    return `/?${params.toString()}`;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <FilterBar />

        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-semibold md:text-xl">
            {total > 0 ? `${total} việc làm phù hợp` : 'Việc làm nổi bật'}
          </h1>

          {items.length === 0 ? (
            <EmptyState
              title="Không tìm thấy việc làm phù hợp"
              description="Thử điều chỉnh bộ lọc."
              action={
                <Link href="/">
                  <Button variant="secondary">Xóa bộ lọc</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((job) => (
                <JobCard key={job.id} job={job} href={`/viec-lam/${job.id}`} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              {page > 1 && (
                <Link href={pageHref(page - 1)}>
                  <Button variant="secondary">← Trang trước</Button>
                </Link>
              )}
              <span className="text-sm text-muted">
                Trang {page}/{totalPages}
              </span>
              {page < totalPages && (
                <Link href={pageHref(page + 1)}>
                  <Button variant="secondary">Trang sau →</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
