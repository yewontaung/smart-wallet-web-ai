import { ManagerUser } from '../types';
import { ManagerLoginInputDto } from '../schemas/inputs';

const MOCK_MANAGER: ManagerUser = {
  id: 'mgr_admin_001',
  username: 'admin.manager',
  email: 'admin.banking@smartwallet.internal',
  role: 'super_admin',
  department: 'Financial Ops & Compliance',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  lastLogin: '2026-08-13T09:14:22Z',
};

class ManagerAuthService {
  private sessionKey = 'smart_wallet_manager_session_v1';

  login(input: ManagerLoginInputDto): { success: boolean; token?: string; user?: ManagerUser; error?: string } {
    if (!input.username || !input.passwordHash) {
      return { success: false, error: 'Username and password are required.' };
    }
    // Allow demo authentication
    if (input.username.toLowerCase() === 'admin.manager' || input.username.toLowerCase() === 'admin') {
      const token = `m_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem(this.sessionKey, JSON.stringify({ token, user: MOCK_MANAGER }));
      return { success: true, token, user: MOCK_MANAGER };
    }
    return { success: false, error: 'Invalid admin credentials. (Demo login: admin / admin)' };
  }

  getCurrentSession(): { user: ManagerUser; token: string } | null {
    const data = localStorage.getItem(this.sessionKey);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }
}

export const managerAuthService = new ManagerAuthService();
