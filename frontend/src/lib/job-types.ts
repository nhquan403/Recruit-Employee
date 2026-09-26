export type JobStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApplicationStatus = 'PENDING' | 'VIEWED' | 'INTERVIEW' | 'REJECTED';

export interface Job {
  id: string;
  title: string;
  description: string;
  area: string;
  shift: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryUnit: string;
  requirements: string | null;
  status: JobStatus;
  rejectReason: string | null;
  employerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { applications: number };
}

export interface ApplicationCandidate {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  profile: {
    bio: string | null;
    skills: string[];
    preferredAreas: string[];
  } | null;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  candidate?: ApplicationCandidate;
  job?: Pick<Job, 'id' | 'title' | 'area' | 'shift' | 'salaryMin' | 'salaryMax' | 'salaryUnit'>;
}

export function formatSalary(job: Pick<Job, 'salaryMin' | 'salaryMax' | 'salaryUnit'>): string {
  if (job.salaryMin == null && job.salaryMax == null) {
    return 'Thỏa thuận';
  }
  const format = (n: number) => n.toLocaleString('vi-VN');
  if (job.salaryMin != null && job.salaryMax != null) {
    return `${format(job.salaryMin)}–${format(job.salaryMax)}đ/${job.salaryUnit.split('/')[1] ?? 'giờ'}`;
  }
  const single = job.salaryMin ?? job.salaryMax ?? 0;
  return `${format(single)}đ/${job.salaryUnit.split('/')[1] ?? 'giờ'}`;
}

export function jobStatusToBadge(status: JobStatus): 'pending' | 'approved' | 'rejected' {
  if (status === 'APPROVED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  return 'pending';
}

export function applicationStatusToBadge(
  status: ApplicationStatus,
): 'pending' | 'viewed' | 'interview' | 'rejected' {
  return status.toLowerCase() as 'pending' | 'viewed' | 'interview' | 'rejected';
}
