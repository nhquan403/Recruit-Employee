import { render, screen } from '@testing-library/react';
import { ApplyButton } from './apply-button';
import { useAuth } from '@/lib/auth-context';
import { Job } from '@/lib/job-types';

jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const mockedUseAuth = useAuth as jest.Mock;

const approvedJob: Job = {
  id: 'job-1',
  title: 'Phục vụ quán cà phê',
  description: 'desc',
  area: 'Quận 1',
  shift: 'Tối',
  salaryMin: 20000,
  salaryMax: 25000,
  salaryUnit: 'VND/giờ',
  requirements: null,
  status: 'APPROVED',
  rejectReason: null,
  employerId: 'employer-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ApplyButton', () => {
  it('shows a login prompt when logged out', () => {
    mockedUseAuth.mockReturnValue({ user: null, accessToken: null });
    render(<ApplyButton job={approvedJob} />);
    expect(screen.getByText('Đăng nhập để ứng tuyển')).toBeInTheDocument();
  });

  it('shows the apply action for a candidate who has not applied yet', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'c1', role: 'CANDIDATE', email: 'c@test.com', fullName: 'C' },
      accessToken: 'token',
    });
    render(<ApplyButton job={approvedJob} />);
    expect(screen.getByRole('button', { name: 'Ứng tuyển ngay' })).toBeInTheDocument();
  });

  it('shows an applied badge for a candidate who already applied', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'c1', role: 'CANDIDATE', email: 'c@test.com', fullName: 'C' },
      accessToken: 'token',
    });
    render(<ApplyButton job={approvedJob} initialApplicationStatus="INTERVIEW" />);
    expect(screen.getByText('Đã ứng tuyển')).toBeInTheDocument();
    expect(screen.getByText('Mời phỏng vấn')).toBeInTheDocument();
  });

  it('tells an employer they cannot apply', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'e1', role: 'EMPLOYER', email: 'e@test.com', fullName: 'E' },
      accessToken: 'token',
    });
    render(<ApplyButton job={approvedJob} />);
    expect(screen.getByText('Tài khoản nhà tuyển dụng không thể ứng tuyển')).toBeInTheDocument();
  });

  it('tells an admin they are viewing in an administrative capacity', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'a1', role: 'ADMIN', email: 'a@test.com', fullName: 'A' },
      accessToken: 'token',
    });
    render(<ApplyButton job={approvedJob} />);
    expect(screen.getByText('Xem với vai trò quản trị')).toBeInTheDocument();
  });

  it('shows a disabled "closed" button for a non-approved job', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'c1', role: 'CANDIDATE', email: 'c@test.com', fullName: 'C' },
      accessToken: 'token',
    });
    render(<ApplyButton job={{ ...approvedJob, status: 'PENDING' }} />);
    expect(screen.getByRole('button', { name: 'Tin đã đóng' })).toBeDisabled();
  });
});
