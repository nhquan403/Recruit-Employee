'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/ui/tag';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge, StatusBadgeStatus } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';

const statuses: StatusBadgeStatus[] = ['pending', 'viewed', 'interview', 'approved', 'rejected'];

// Dev-only kitchen-sink page — remove or gate before final submission (see Phase 8).
export default function DesignPreviewPage() {
  const { showToast } = useToast();
  const [selected, setSelected] = useState(false);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold md:text-3xl">Design Preview</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Ứng tuyển ngay</Button>
          <Button variant="secondary">Hủy</Button>
          <Button variant="destructive">Từ chối</Button>
          <Button variant="ghost">Xem hồ sơ</Button>
          <Button variant="primary" loading>
            Đang gửi...
          </Button>
          <Button variant="primary" disabled>
            Vô hiệu hóa
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Form fields</h2>
        <Input label="Tiêu đề công việc" placeholder="VD: Nhân viên phục vụ ca tối" required />
        <Input label="Email" error="Email không hợp lệ" defaultValue="not-an-email" />
        <Select
          label="Khu vực"
          placeholder="Chọn khu vực"
          options={[
            { value: 'q1', label: 'Quận 1' },
            { value: 'q3', label: 'Quận 3' },
          ]}
        />
        <Textarea label="Mô tả công việc" placeholder="Mô tả chi tiết công việc..." />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Tag>Pha chế</Tag>
          <Tag selected={selected} onClick={() => setSelected((v) => !v)}>
            Quận 1 (bấm để chọn)
          </Tag>
          <Tag onRemove={() => showToast('Đã xóa thẻ', 'info')}>Giao tiếp tốt</Tag>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Avatar</h2>
        <div className="flex items-center gap-3">
          <Avatar name="Nguyễn Văn A" size="sm" />
          <Avatar name="Nguyễn Văn A" size="md" />
          <Avatar name="Nguyễn Văn A" size="lg" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Status badges</h2>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Empty state</h2>
        <EmptyState
          title="Không tìm thấy việc làm phù hợp"
          description="Thử điều chỉnh bộ lọc."
          action={<Button variant="secondary">Xóa bộ lọc</Button>}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold md:text-xl">Toast</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => showToast('Ứng tuyển thành công!', 'success')}>
            Trigger success
          </Button>
          <Button variant="destructive" onClick={() => showToast('Có lỗi xảy ra', 'error')}>
            Trigger error
          </Button>
          <Button variant="ghost" onClick={() => showToast('Đây là thông báo', 'info')}>
            Trigger info
          </Button>
        </div>
      </section>
    </main>
  );
}
