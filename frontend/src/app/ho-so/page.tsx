'use client';

import { useEffect, useMemo, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Application, ApplicationStatus } from '@/lib/job-types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';
import { ApplicationRow } from '@/components/application-row';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';

interface Profile {
  bio: string | null;
  skills: string[];
  preferredAreas: string[];
}

const STATUS_TABS: { value: ApplicationStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Đang chờ' },
  { value: 'INTERVIEW', label: 'Phỏng vấn' },
  { value: 'REJECTED', label: 'Kết quả' },
];

function ProfileView() {
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [areaInput, setAreaInput] = useState('');
  const [preferredAreas, setPreferredAreas] = useState<string[]>([]);
  const [statusTab, setStatusTab] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    apiFetch<Profile>('/profiles/me', { token: accessToken }).then((p) => {
      setProfile(p);
      setBio(p.bio ?? '');
      setSkills(p.skills);
      setPreferredAreas(p.preferredAreas);
    });
    apiFetch<Application[]>('/applications/mine', { token: accessToken }).then(setApplications);
  }, [accessToken]);

  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    if (statusTab === 'ALL') return applications;
    return applications.filter((app) => app.status === statusTab);
  }, [applications, statusTab]);

  function addTag(list: string[], setList: (v: string[]) => void, value: string, clear: () => void) {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    clear();
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const updated = await apiFetch<Profile>('/profiles/me', {
        method: 'PATCH',
        token: accessToken,
        body: { bio, skills, preferredAreas },
      });
      setProfile(updated);
      setIsEditing(false);
      showToast('Đã cập nhật hồ sơ', 'success');
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Cập nhật thất bại', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (!profile || !user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <p className="text-sm text-muted">Đang tải...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 md:px-6">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hồ sơ của tôi</h1>
          {!isEditing ? (
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              Sửa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button variant="primary" loading={isSaving} onClick={handleSave}>
                Lưu
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <p className="text-lg font-semibold">{user.fullName}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-slate-900">Giới thiệu ngắn</p>
            {isEditing ? (
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" />
            ) : (
              <p className="mt-1 text-sm text-slate-700">{bio || 'Chưa có giới thiệu'}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">Kỹ năng</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Tag
                  key={skill}
                  onRemove={isEditing ? () => setSkills(skills.filter((s) => s !== skill)) : undefined}
                >
                  {skill}
                </Tag>
              ))}
            </div>
            {isEditing && (
              <div className="mt-2 flex gap-2">
                <Input
                  aria-label="Thêm kỹ năng"
                  placeholder="VD: Pha chế"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(skills, setSkills, skillInput, () => setSkillInput(''));
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => addTag(skills, setSkills, skillInput, () => setSkillInput(''))}
                >
                  Thêm
                </Button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">Khu vực mong muốn</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {preferredAreas.map((area) => (
                <Tag
                  key={area}
                  onRemove={
                    isEditing
                      ? () => setPreferredAreas(preferredAreas.filter((a) => a !== area))
                      : undefined
                  }
                >
                  {area}
                </Tag>
              ))}
            </div>
            {isEditing && (
              <div className="mt-2 flex gap-2">
                <Input
                  aria-label="Thêm khu vực"
                  placeholder="VD: Quận 1"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(preferredAreas, setPreferredAreas, areaInput, () => setAreaInput(''));
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    addTag(preferredAreas, setPreferredAreas, areaInput, () => setAreaInput(''))
                  }
                >
                  Thêm
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Việc đã ứng tuyển ({applications?.length ?? 0})</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Tag key={tab.value} selected={statusTab === tab.value} onClick={() => setStatusTab(tab.value)}>
              {tab.label}
            </Tag>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {applications && filteredApplications.length === 0 && (
            <EmptyState title="Chưa có tin nào trong mục này" />
          )}
          {filteredApplications.map((application) => (
            <ApplicationRow key={application.id} application={application} variant="candidate" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <RequireRole allow={['CANDIDATE']}>
      <ProfileView />
    </RequireRole>
  );
}
