import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ConnectionBanner = ({
  isBackendConnected,
  errorMessage,
  onRetry,
  isLoading,
}) => {
  if (isBackendConnected) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-rose-200">
            {errorMessage || 'Backend API server is not responding at http://localhost:5000'}
          </p>
          <p className="text-xs text-rose-300/80">
            Make sure your Express server is running in the backend directory:{' '}
            <code className="bg-rose-950/60 px-1.5 py-0.5 rounded text-rose-200">
              cd backend && npm run dev
            </code>
          </p>
        </div>
      </div>
      <button
        onClick={onRetry}
        disabled={isLoading}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 transition-all cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        <span>Retry Connection</span>
      </button>
    </div>
  );
};

export default ConnectionBanner;
