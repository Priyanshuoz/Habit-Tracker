import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Shield,
  Lock,
  Unlock,
  Camera,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Columns,
  SlidersHorizontal,
  Calendar,
  Scale,
  Sparkles,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import vaultApi from '../services/vaultApi';
import { SAMPLE_AVATARS } from '../utils/avatarUtils';

const ProfileVaultModal = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'vault'

  // Profile Edit State
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [sampleCategory, setSampleCategory] = useState('All');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Vault State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [isSettingNewPin, setIsSettingNewPin] = useState(false);
  const [hasPinConfigured, setHasPinConfigured] = useState(false);
  const [vaultError, setVaultError] = useState('');
  const [vaultPhotos, setVaultPhotos] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState('All');

  // Vault Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Physique');
  const [uploadImage, setUploadImage] = useState('');
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [uploadWeight, setUploadWeight] = useState('');
  const [uploadNote, setUploadNote] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Vault Comparison State
  const [comparisonMode, setComparisonMode] = useState(false); // view comparison
  const [selectedPhotoA, setSelectedPhotoA] = useState(null);
  const [selectedPhotoB, setSelectedPhotoB] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [comparisonLayout, setComparisonLayout] = useState('split'); // 'split' | 'slider'

  const fileInputRef = useRef(null);
  const vaultFileInputRef = useRef(null);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.name || '');
      setAvatar(currentUser?.avatar || '');
      setProfileSuccess('');
      setProfileError('');
      setActiveTab(initialTab);

      // Check pin
      const hasPin = Boolean(currentUser?.hasVaultPin) || vaultApi.hasLocalPinSet();
      setHasPinConfigured(hasPin);
      setIsSettingNewPin(!hasPin);
      setPinInput('');
      setConfirmPinInput('');
      setVaultError('');
    } else {
      // Re-lock vault on close for privacy
      setIsUnlocked(false);
      setComparisonMode(false);
    }
  }, [isOpen, currentUser, initialTab]);

  // Load photos when vault is unlocked
  useEffect(() => {
    if (isUnlocked) {
      loadVaultPhotos();
    }
  }, [isUnlocked]);

  const loadVaultPhotos = async () => {
    setIsLoadingPhotos(true);
    try {
      const photos = await vaultApi.getPhotos();
      setVaultPhotos(photos || []);
      if (photos && photos.length >= 2) {
        setSelectedPhotoA(photos[photos.length - 1]); // oldest
        setSelectedPhotoB(photos[0]); // newest
      } else if (photos && photos.length === 1) {
        setSelectedPhotoA(photos[0]);
      }
    } catch {
      setVaultError('Failed to load photos');
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  // Convert uploaded image to base64 with downscaling
  const processImageFile = (file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Profile Handlers
  const handleProfileImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setAvatar(dataUrl);
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError('Name cannot be empty');
      return;
    }
    setIsSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const updatedUser = await vaultApi.updateProfile(name, avatar);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setProfileSuccess('Profile photo and details updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Error updating profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Vault Unlock / Setup Handlers
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setVaultError('');

    if (pinInput.length !== 4) {
      setVaultError('PIN must be exactly 4 digits');
      return;
    }

    if (isSettingNewPin) {
      if (confirmPinInput.length !== 4) {
        setVaultError('Please confirm your 4-digit PIN');
        return;
      }
      if (pinInput !== confirmPinInput) {
        setVaultError('PINs do not match');
        return;
      }

      try {
        await vaultApi.verifyOrSetPin(pinInput, 'set');
        setHasPinConfigured(true);
        setIsSettingNewPin(false);
        setIsUnlocked(true);
      } catch (err) {
        setVaultError(err.message || 'Error configuring PIN');
      }
    } else {
      try {
        await vaultApi.verifyOrSetPin(pinInput, 'unlock');
        setIsUnlocked(true);
      } catch (err) {
        setVaultError(err.message || 'Incorrect PIN. Please try again.');
      }
    }
  };

  // Vault Photo Upload
  const handleVaultPhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, (dataUrl) => {
        setUploadImage(dataUrl);
      });
    }
  };

  const handleSaveVaultPhoto = async (e) => {
    e.preventDefault();
    if (!uploadImage) {
      setVaultError('Please select a photo to upload');
      return;
    }

    setIsUploadingPhoto(true);
    setVaultError('');

    try {
      const newPhoto = await vaultApi.addPhoto({
        imageUrl: uploadImage,
        category: uploadCategory,
        date: uploadDate,
        weight: uploadWeight,
        note: uploadNote,
      });

      setVaultPhotos((prev) => [newPhoto, ...prev]);
      setIsUploadModalOpen(false);
      setUploadImage('');
      setUploadNote('');
      setUploadWeight('');
    } catch (err) {
      setVaultError(err.message || 'Failed to save photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this private photo?')) return;
    try {
      await vaultApi.deletePhoto(photoId);
      setVaultPhotos((prev) => prev.filter((p) => p.id !== photoId && p._id !== photoId));
      if (selectedPhotoA?.id === photoId) setSelectedPhotoA(null);
      if (selectedPhotoB?.id === photoId) setSelectedPhotoB(null);
    } catch {
      alert('Error deleting photo');
    }
  };

  if (!isOpen) return null;

  const filteredPhotos = vaultPhotos.filter((photo) => {
    if (vaultCategoryFilter === 'All') return true;
    return photo.category === vaultCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header with Navigation Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Private Vault</span>
              {!isUnlocked && <Lock className="w-3.5 h-3.5 text-amber-400 ml-1" />}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          {/* TAB 1: PROFILE PHOTO & DETAILS */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Your Profile Photo</h3>
                <p className="text-xs text-slate-400">
                  Upload an image from your device, choose a preset, or paste a URL.
                </p>
              </div>

              {profileSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 to-emerald-500 p-1 shadow-xl shadow-indigo-500/20">
                    <div className="w-full h-full bg-slate-950 rounded-[22px] overflow-hidden flex items-center justify-center">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-extrabold text-white">
                          {name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick file trigger overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Photo"
                    className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/40 border-2 border-slate-900 transition-all cursor-pointer active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageFile}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors cursor-pointer border border-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Avatars Selector */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Or choose a sample avatar:</span>
                  </p>
                  
                  {/* Category Pills */}
                  <div className="flex items-center gap-1">
                    {['All', 'Cartoonish', 'Rage Mode'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSampleCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                          sampleCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 pt-1">
                  {SAMPLE_AVATARS.filter((s) => sampleCategory === 'All' || s.category === sampleCategory).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvatar(item.url)}
                      title={item.name}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group hover:scale-105 ${
                        avatar === item.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105 shadow-md shadow-indigo-500/30'
                          : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name field */}
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile Photo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PRIVATE VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              
              {/* UNLOCKED STATE */}
              {isUnlocked ? (
                <div className="space-y-6">
                  {/* Vault Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Unlock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Private Progress Vault</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            UNLOCKED
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Secure face & physique comparison photos. Private to you.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setComparisonMode(!comparisonMode)}
                        disabled={vaultPhotos.length < 2}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          comparisonMode
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40'
                        }`}
                      >
                        <Columns className="w-3.5 h-3.5" />
                        <span>Compare Photos ({vaultPhotos.length})</span>
                      </button>

                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Add Photo</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUnlocked(false);
                          setComparisonMode(false);
                        }}
                        title="Lock Vault Now"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700/50 transition-colors cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* COMPARISON VIEW */}
                  {comparisonMode && vaultPhotos.length >= 2 && (
                    <div className="p-5 rounded-3xl bg-slate-950/70 border border-indigo-500/30 space-y-5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-sm font-bold text-white">Before & After Comparison</h4>
                        </div>

                        {/* Layout Switcher */}
                        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                          <button
                            onClick={() => setComparisonLayout('split')}
                            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                              comparisonLayout === 'split'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Side-by-Side
                          </button>
                          <button
                            onClick={() => setComparisonLayout('slider')}
                            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                              comparisonLayout === 'slider'
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Interactive Slider
                          </button>
                        </div>
                      </div>

                      {/* Selectors for Photo A and Photo B */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Photo A (Earlier / Before):
                          </label>
                          <select
                            value={selectedPhotoA?.id || ''}
                            onChange={(e) => {
                              const found = vaultPhotos.find((p) => p.id === e.target.value);
                              setSelectedPhotoA(found);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {vaultPhotos.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.category} — {p.date} {p.weight ? `(${p.weight})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Photo B (Recent / After):
                          </label>
                          <select
                            value={selectedPhotoB?.id || ''}
                            onChange={(e) => {
                              const found = vaultPhotos.find((p) => p.id === e.target.value);
                              setSelectedPhotoB(found);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            {vaultPhotos.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.category} — {p.date} {p.weight ? `(${p.weight})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Visual Display */}
                      {selectedPhotoA && selectedPhotoB && (
                        <>
                          {comparisonLayout === 'split' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Before Card */}
                              <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-amber-400 uppercase tracking-wide">
                                    Before ({selectedPhotoA.date})
                                  </span>
                                  {selectedPhotoA.weight && (
                                    <span className="text-slate-400 flex items-center gap-1">
                                      <Scale className="w-3 h-3" />
                                      {selectedPhotoA.weight}
                                    </span>
                                  )}
                                </div>
                                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black/40">
                                  <img
                                    src={selectedPhotoA.imageUrl}
                                    alt="Before"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {selectedPhotoA.note && (
                                  <p className="text-[11px] text-slate-400 italic">
                                    "{selectedPhotoA.note}"
                                  </p>
                                )}
                              </div>

                              {/* After Card */}
                              <div className="space-y-2 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-emerald-400 uppercase tracking-wide">
                                    After ({selectedPhotoB.date})
                                  </span>
                                  {selectedPhotoB.weight && (
                                    <span className="text-slate-400 flex items-center gap-1">
                                      <Scale className="w-3 h-3" />
                                      {selectedPhotoB.weight}
                                    </span>
                                  )}
                                </div>
                                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black/40">
                                  <img
                                    src={selectedPhotoB.imageUrl}
                                    alt="After"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                {selectedPhotoB.note && (
                                  <p className="text-[11px] text-slate-400 italic">
                                    "{selectedPhotoB.note}"
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Interactive Slider Comparison */
                            <div className="space-y-3">
                              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl select-none">
                                {/* Base Image (After) */}
                                <img
                                  src={selectedPhotoB.imageUrl}
                                  alt="After"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Clipped Image (Before) */}
                                <div
                                  className="absolute inset-0 overflow-hidden"
                                  style={{ width: `${sliderPosition}%` }}
                                >
                                  <img
                                    src={selectedPhotoA.imageUrl}
                                    alt="Before"
                                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                                    style={{ width: '100%', height: '100%' }}
                                  />
                                </div>

                                {/* Divider Line */}
                                <div
                                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center -ml-0.5"
                                  style={{ left: `${sliderPosition}%` }}
                                >
                                  <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white">
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                  </div>
                                </div>

                                {/* Badges */}
                                <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-amber-300">
                                  BEFORE ({selectedPhotoA.date})
                                </span>
                                <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-emerald-300">
                                  AFTER ({selectedPhotoB.date})
                                </span>
                              </div>

                              {/* Slider Range Controller */}
                              <div className="max-w-md mx-auto flex items-center gap-3">
                                <span className="text-[11px] text-slate-400">Before</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={sliderPosition}
                                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                                  className="flex-1 accent-indigo-500 cursor-pointer"
                                />
                                <span className="text-[11px] text-slate-400">After</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* GALLERY OF PHOTOS */}
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {['All', 'Physique', 'Face'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setVaultCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              vaultCategoryFilter === cat
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                                : 'text-slate-400 hover:text-white bg-slate-800/60'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <span className="text-xs text-slate-500">
                        {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>

                    {/* Photos Grid */}
                    {isLoadingPhotos ? (
                      <div className="py-16 text-center text-slate-500 text-xs">
                        Loading secure vault photos...
                      </div>
                    ) : filteredPhotos.length === 0 ? (
                      <div className="py-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                        <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                        <div>
                          <p className="text-sm font-semibold text-slate-300">No photos added yet</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload face or physique photos to track your journey securely.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsUploadModalOpen(true)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          Add Your First Photo
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {filteredPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
                          >
                            <div className="aspect-[4/5] overflow-hidden">
                              <img
                                src={photo.imageUrl}
                                alt={photo.category}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Tag overlay */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              <span className="px-2 py-0.5 bg-slate-900/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-slate-700">
                                {photo.category}
                              </span>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              title="Delete photo"
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Info bar at bottom */}
                            <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] space-y-0.5">
                              <div className="flex items-center justify-between text-slate-300 font-medium">
                                <span>{photo.date}</span>
                                {photo.weight && <span className="text-emerald-400">{photo.weight}</span>}
                              </div>
                              {photo.note && (
                                <p className="text-[10px] text-slate-500 truncate" title={photo.note}>
                                  {photo.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* LOCKED PASSCODE SCREEN */
                <div className="max-w-md mx-auto py-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                    <Shield className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {isSettingNewPin ? 'Setup Secret Vault Passcode' : 'Private Vault Locked'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                      {isSettingNewPin
                        ? 'Create a secret 4-digit PIN to protect your face & physique progress photos.'
                        : 'Enter your secret 4-digit PIN to access your private photos and comparison tool.'}
                    </p>
                  </div>

                  {vaultError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{vaultError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePinSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Enter 4-Digit PIN:</label>
                      <input
                        type="password"
                        maxLength="4"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoFocus
                        placeholder="••••"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-44 text-center tracking-[0.6em] text-3xl font-bold bg-slate-950 border border-slate-800 rounded-2xl py-3 text-white focus:outline-none focus:border-emerald-500 transition-all mx-auto"
                      />
                    </div>

                    {isSettingNewPin && (
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Confirm 4-Digit PIN:</label>
                        <input
                          type="password"
                          maxLength="4"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="••••"
                          value={confirmPinInput}
                          onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-44 text-center tracking-[0.6em] text-3xl font-bold bg-slate-950 border border-slate-800 rounded-2xl py-3 text-white focus:outline-none focus:border-emerald-500 transition-all mx-auto"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={pinInput.length !== 4 || (isSettingNewPin && confirmPinInput.length !== 4)}
                      className="w-full max-w-xs mx-auto py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isSettingNewPin ? 'Create 4-Digit PIN & Open Vault' : 'Unlock Private Vault'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>

        {/* VAULT PHOTO UPLOAD SUB-MODAL */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Add Vault Photo</span>
                </h4>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVaultPhoto} className="space-y-4">
                {/* Photo Preview & Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">Photo</label>
                  <div
                    onClick={() => vaultFileInputRef.current?.click()}
                    className="relative aspect-video rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                  >
                    {uploadImage ? (
                      <img src={uploadImage} alt="Upload preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4 text-slate-400 group-hover:text-emerald-400 transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-70" />
                        <span className="text-xs font-semibold">Click to select photo from device</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={vaultFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleVaultPhotoFile}
                    className="hidden"
                  />
                </div>

                {/* Category: Physique vs Face */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Physique', 'Face'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setUploadCategory(cat)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          uploadCategory === cat
                            ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={uploadDate}
                      onChange={(e) => setUploadDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Weight (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 74.5 kg"
                      value={uploadWeight}
                      onChange={(e) => setUploadWeight(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Day 14 on strict diet plan"
                    value={uploadNote}
                    onChange={(e) => setUploadNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadImage || isUploadingPhoto}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                  >
                    {isUploadingPhoto ? 'Saving...' : 'Save to Vault'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileVaultModal;
