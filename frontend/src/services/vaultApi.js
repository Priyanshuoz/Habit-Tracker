import apiClient from './habitApi';

const VAULT_PHOTOS_KEY = 'habit_tracker_vault_photos';
const VAULT_PIN_KEY = 'habit_tracker_vault_pin';

export const vaultApi = {
  updateProfile: async (name, avatar) => {
    try {
      const response = await apiClient.put('/auth/profile', { name, avatar });
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      // Local fallback
      const saved = localStorage.getItem('user');
      const user = saved ? JSON.parse(saved) : {};
      if (name) user.name = name;
      if (avatar !== undefined) user.avatar = avatar;
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  },

  verifyOrSetPin: async (pin, action = 'unlock', newPin = '') => {
    try {
      const response = await apiClient.post('/auth/vault/pin', { pin, action, newPin });
      return response.data;
    } catch {
      // Local demo fallback
      const storedPin = localStorage.getItem(VAULT_PIN_KEY);
      if (!storedPin) {
        localStorage.setItem(VAULT_PIN_KEY, pin);
        return { success: true, message: 'PIN created', unlocked: true };
      }
      if (action === 'change') {
        if (storedPin !== pin) {
          throw new Error('Incorrect current PIN');
        }
        localStorage.setItem(VAULT_PIN_KEY, newPin);
        return { success: true, message: 'PIN changed', unlocked: true };
      }
      if (storedPin === pin) {
        return { success: true, message: 'Unlocked', unlocked: true };
      }
      throw new Error('Incorrect Vault PIN');
    }
  },

  hasLocalPinSet: () => {
    return Boolean(localStorage.getItem(VAULT_PIN_KEY));
  },

  getPhotos: async () => {
    try {
      const response = await apiClient.get('/auth/vault/photos');
      return response.data;
    } catch {
      const raw = localStorage.getItem(VAULT_PHOTOS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  },

  addPhoto: async (photoData) => {
    try {
      const response = await apiClient.post('/auth/vault/photos', photoData);
      return response.data;
    } catch {
      const raw = localStorage.getItem(VAULT_PHOTOS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const newPhoto = {
        ...photoData,
        id: 'vp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: photoData.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      const updated = [newPhoto, ...list];
      localStorage.setItem(VAULT_PHOTOS_KEY, JSON.stringify(updated));
      return newPhoto;
    }
  },

  deletePhoto: async (id) => {
    try {
      const response = await apiClient.delete(`/auth/vault/photos/${id}`);
      return response.data;
    } catch {
      const raw = localStorage.getItem(VAULT_PHOTOS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const updated = list.filter((p) => p.id !== id && p._id !== id);
      localStorage.setItem(VAULT_PHOTOS_KEY, JSON.stringify(updated));
      return { success: true };
    }
  },
};

export default vaultApi;
