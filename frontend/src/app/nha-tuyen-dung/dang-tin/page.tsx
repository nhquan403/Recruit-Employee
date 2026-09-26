'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { AREA_OPTIONS, SHIFT_OPTIONS } from '@/lib/job-constants';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

function PostJobForm() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [shift, setShift] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [requirements, setRequirements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (title.trim().length < 3) nextErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    if (description.trim().length < 10) nextErrors.description = 'Mô tả phải có ít nhất 10 ký tự';
    if (!area) nextErrors.area = 'Vui lòng chọn khu vực';
    if (!shift) nextErrors.shift = 'Vui lòng chọn khung giờ';
    if (
      salaryMin &&
      salaryMax &&
      Number(salaryMin) > Number(salaryMax)
    ) {
      nextErrors.salaryMax = 'Mức lương tối đa phải lớn hơn hoặc bằng mức lương tối thiểu';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await apiFetch('/jobs', {
        method: 'POST',
        token: accessToken,
        body: {
          title,
          description,
          area,
          shift,
          requirements: requirements || undefined,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryMax: salaryMax ? Number(salaryMax) : undefined,
        },
      });
      showToast('Tin đăng đã được gửi, đang chờ duyệt', 'success');
      router.push('/nha-tuyen-dung/tin-cua-toi');
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Đăng tin thất bại', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold">Đăng tin tuyển dụng</h1>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Tiêu đề công việc"
          required
          placeholder="VD: Nhân viên phục vụ ca tối"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />
        <Textarea
          label="Mô tả công việc"
          required
          placeholder="Mô tả chi tiết công việc..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />
        <Select
          label="Khu vực"
          required
          placeholder="Chọn khu vực"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          options={AREA_OPTIONS.map((a) => ({ value: a, label: a }))}
          error={errors.area}
        />

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-900">
            Khung giờ làm việc <span className="text-muted">(Bắt buộc)</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {SHIFT_OPTIONS.map((option) => (
              <Tag key={option} selected={shift === option} onClick={() => setShift(option)}>
                {option}
              </Tag>
            ))}
          </div>
          {errors.shift && <p className="text-xs text-destructive">{errors.shift}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Lương từ (đ/giờ)"
            type="number"
            min={0}
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
          <Input
            label="Lương đến (đ/giờ)"
            type="number"
            min={0}
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            error={errors.salaryMax}
          />
        </div>

        <Textarea
          label="Yêu cầu ứng viên"
          placeholder="VD: Giao tiếp tốt, có thể làm ca tối..."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />

        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">
          ℹ️ Tin đăng sẽ được admin duyệt trước khi hiển thị công khai.
        </p>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Đăng tin
          </Button>
        </div>
      </form>
    </main>
  );
}

export default function PostJobPage() {
  return (
    <RequireRole allow={['EMPLOYER']}>
      <PostJobForm />
    </RequireRole>
  );
}
