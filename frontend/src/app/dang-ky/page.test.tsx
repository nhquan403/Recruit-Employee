import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from './page';
import { useAuth } from '@/lib/auth-context';

jest.mock('@/lib/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('RegisterPage validation', () => {
  it('shows validation errors and never calls register() when the form is empty', () => {
    const register = jest.fn();
    mockedUseAuth.mockReturnValue({ register });

    render(<RegisterPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    expect(screen.getByText('Vui lòng nhập họ tên (ít nhất 2 ký tự)')).toBeInTheDocument();
    expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
    expect(screen.getByText('Mật khẩu phải có ít nhất 8 ký tự')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it('calls register() once the form passes validation', () => {
    const register = jest.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({ register });

    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText(/Họ và tên/), { target: { value: 'Nguyễn Văn A' } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'a@test.com' } });
    fireEvent.change(screen.getByLabelText(/Mật khẩu/), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký' }));

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'a@test.com', role: 'CANDIDATE' }),
    );
  });
});
