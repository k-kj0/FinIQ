'use client';

const STORAGE_KEY = 'finiq_profile';
const INSTALL_KEY = 'finiq_install_date';
const SUB_KEY = 'finiq_subscribed';

export const storage = {
  setProfile(profile: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  },

  getProfile(): any {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  hasProfile(): boolean {
    return !!this.getProfile();
  },

  setInstallDate() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(INSTALL_KEY);
      if (!existing) {
        localStorage.setItem(INSTALL_KEY, new Date().toISOString());
      }
    }
  },

  getInstallDate(): Date | null {
    if (typeof window !== 'undefined') {
      const date = localStorage.getItem(INSTALL_KEY);
      return date ? new Date(date) : null;
    }
    return null;
  },

  isTrialExpired(): boolean {
    const installDate = this.getInstallDate();
    if (!installDate) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - installDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5;
  },

  setSubscribed(active: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUB_KEY, active ? 'true' : 'false');
    }
  },

  isSubscribed(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SUB_KEY) === 'true';
    }
    return false;
  },

  clear() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(INSTALL_KEY);
      localStorage.removeItem(SUB_KEY);
    }
  },
};
