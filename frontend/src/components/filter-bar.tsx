'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AREA_OPTIONS, SHIFT_OPTIONS } from '@/lib/job-constants';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [area, setArea] = useState(searchParams.get('area') ?? '');
  const [shift, setShift] = useState(searchParams.get('shift') ?? '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') ?? '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salaryMax') ?? '');

  function applyFilters(overrides: Record<string, string> = {}) {
    const values: Record<string, string> = { q, area, shift, salaryMin, salaryMax, ...overrides };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  }

  function clearFilters() {
    setQ('');
    setArea('');
    setShift('');
    setSalaryMin('');
    setSalaryMax('');
    router.push('/');
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-4 md:sticky md:top-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="flex flex-col gap-4"
      >
        <Input
          aria-label="Tìm việc làm"
          placeholder="🔍 Tìm việc làm..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select
          label="Khu vực"
          placeholder="Tất cả khu vực"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            applyFilters({ area: e.target.value });
          }}
          options={AREA_OPTIONS.map((a) => ({ value: a, label: a }))}
        />

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-900">Khung giờ</span>
          <div className="flex flex-wrap gap-2">
            {SHIFT_OPTIONS.map((option) => (
              <Tag
                key={option}
                selected={shift === option}
                onClick={() => {
                  const next = shift === option ? '' : option;
                  setShift(next);
                  applyFilters({ shift: next });
                }}
              >
                {option}
              </Tag>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-900">Mức lương (đ/giờ)</span>
          <div className="flex gap-2">
            <Input
              aria-label="Lương từ"
              type="number"
              placeholder="Từ"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
            <Input
              aria-label="Lương đến"
              type="number"
              placeholder="Đến"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" className="flex-1">
            Áp dụng
          </Button>
          <Button type="button" variant="ghost" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        </div>
      </form>
    </div>
  );
}
