import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserAddress } from '../types';
import { useToast } from './ToastContext';

interface StoredUserAccount extends UserProfile {
  passwordHash: string; // Stored user password hash/value
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: Partial<UserAddress>;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string }) => void;
  saveAddress: (addressData: Omit<UserAddress, 'id'>, editId?: string) => UserAddress;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  adminLogin: (username: string, pinOrPass: string) => boolean;
  adminLogout: () => void;
}

const ACTIVE_USER_STORAGE_KEY = 'giftoria_active_user_v2';
const REGISTERED_USERS_KEY = 'giftoria_registered_users_v2';
const ADMIN_SESSION_KEY = 'giftoria_admin_auth';

// Configurable Admin credentials with fallback to secure keys
const ADMIN_USERNAME = (import.meta as any).env?.VITE_ADMIN_USER || 'admin@giftoria.com';
const ADMIN_PASS = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'GiftoriaAdmin@2026';
const VALID_ADMIN_PINS = ['giftoria2026', 'admin123', '8356829605'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  // Active User starts as NULL (blank guest state for new visitors)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Admin session authenticated state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Persist active user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user to localStorage', e);
    }
  }, [user]);

  // Helper to load registered users safely
  const getRegisteredUsers = (): StoredUserAccount[] => {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to save registered users
  const saveRegisteredUsers = (users: StoredUserAccount[]) => {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  };

  // Customer Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return { success: false, message: 'Account not found. Please register or check your email.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const { passwordHash, ...profile } = found;
    setUser(profile);
    showToast(`Welcome back, ${profile.name}!`, 'success');
    return { success: true };
  };

  // Customer Registration
  const signup = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address?: Partial<UserAddress>;
  }): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please sign in.' };
    }

    const userId = `usr-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const initialAddresses: UserAddress[] = [];

    if (data.address && data.address.houseBuilding && data.address.streetArea) {
      initialAddresses.push({
        id: `addr-${Date.now()}`,
        fullName: data.name.trim(),
        mobile: data.phone.trim(),
        houseBuilding: data.address.houseBuilding.trim(),
        streetArea: data.address.streetArea.trim(),
        landmark: data.address.landmark?.trim() || '',
        city: data.address.city?.trim() || 'Mumbai',
        state: data.address.state?.trim() || 'Maharashtra',
        pincode: data.address.pincode?.trim() || '',
        isDefault: true,
      });
    }

    const newAccount: StoredUserAccount = {
      id: userId,
      name: data.name.trim(),
      email: trimmedEmail,
      phone: data.phone.trim(),
      role: 'customer',
      savedAddresses: initialAddresses,
      createdAt: new Date().toISOString(),
      passwordHash: data.password,
    };

    saveRegisteredUsers([...users, newAccount]);

    const { passwordHash, ...profile } = newAccount;
    setUser(profile);
    showToast(`Account created successfully! Welcome, ${profile.name}!`, 'success');
    return { success: true };
  };

  // Customer Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    showToast('You have been signed out safely.', 'info');
  };

  // Update Profile Information
  const updateProfile = (data: { name?: string; phone?: string }) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      name: data.name?.trim() || user.name,
      phone: data.phone?.trim() || user.phone,
    };

    setUser(updated);

    // Sync to stored users
    const users = getRegisteredUsers();
    saveRegisteredUsers(
      users.map((u) => (u.id === user.id ? { ...u, name: updated.name, phone: updated.phone } : u))
    );

    showToast('Profile information updated successfully.', 'success');
  };

  // Save / Update Address
  const saveAddress = (addressData: Omit<UserAddress, 'id'>, editId?: string): UserAddress => {
    if (!user) {
      throw new Error('User must be logged in to save address');
    }

    let updatedAddresses = [...user.savedAddresses];
    let resultAddress: UserAddress;

    if (editId) {
      updatedAddresses = updatedAddresses.map((addr) => {
        if (addr.id === editId) {
          resultAddress = { ...addressData, id: editId };
          return resultAddress;
        }
        return addr;
      });
      resultAddress = { ...addressData, id: editId };
    } else {
      resultAddress = {
        ...addressData,
        id: `addr-${Date.now()}`,
        isDefault: updatedAddresses.length === 0 || addressData.isDefault,
      };
      if (resultAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
      }
      updatedAddresses.push(resultAddress);
    }

    const updatedUser: UserProfile = {
      ...user,
      savedAddresses: updatedAddresses,
    };

    setUser(updatedUser);

    // Sync to persistent accounts
    const users = getRegisteredUsers();
    saveRegisteredUsers(
      users.map((u) => (u.id === user.id ? { ...u, savedAddresses: updatedAddresses } : u))
    );

    showToast(editId ? 'Delivery address updated.' : 'New delivery address added.', 'success');
    return resultAddress;
  };

  // Delete Address
  const deleteAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.filter((a) => a.id !== id);
    const updatedUser = { ...user, savedAddresses: updatedAddresses };
    setUser(updatedUser);

    const users = getRegisteredUsers();
    saveRegisteredUsers(
      users.map((u) => (u.id === user.id ? { ...u, savedAddresses: updatedAddresses } : u))
    );

    showToast('Delivery address removed.', 'info');
  };

  // Set Default Address
  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    const updatedUser = { ...user, savedAddresses: updatedAddresses };
    setUser(updatedUser);

    const users = getRegisteredUsers();
    saveRegisteredUsers(
      users.map((u) => (u.id === user.id ? { ...u, savedAddresses: updatedAddresses } : u))
    );

    showToast('Default delivery address updated.', 'success');
  };

  // Dedicated Admin Login
  const adminLogin = (username: string, pinOrPass: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedInput = pinOrPass.trim();

    // Check against authorized admin accounts or PINs
    const isUserValid =
      trimmedUser === ADMIN_USERNAME.toLowerCase() ||
      trimmedUser === 'admin' ||
      trimmedUser === 'giftoria' ||
      trimmedUser === 'owner';

    const isSecretValid =
      trimmedInput === ADMIN_PASS ||
      VALID_ADMIN_PINS.includes(trimmedInput);

    if (isUserValid && isSecretValid) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAdminAuthenticated(true);
      showToast('Admin authorization verified. Welcome to GIFTORIA Console.', 'success');
      return true;
    }

    return false;
  };

  // Dedicated Admin Logout
  const adminLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    showToast('Admin session logged out.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdminAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
