import { Download } from 'lucide-react';

interface DownloadButtonProps {
  eventCount: number;
  onDownload: () => void;
  error?: string | null;
}

export default function DownloadButton({ eventCount, onDownload, error }: DownloadButtonProps) {
  const disabled = eventCount === 0;

  return (
    <div className="space-y-2">
      {error && (
        <p
          className="text-[13px] text-center rounded-xl px-4 py-2.5"
          style={{ color: '#FF3B30', background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.15)' }}
        >
          {error}
        </p>
      )}
      <button
        onClick={onDownload}
        disabled={disabled}
        aria-disabled={disabled}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl font-semibold transition-all duration-150 cursor-pointer disabled:cursor-not-allowed select-none"
        style={{
          height: '54px',
          fontSize: '16px',
          background: disabled
            ? 'rgba(120,120,128,0.18)'
            : 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)',
          color: disabled ? '#AEAEB2' : '#fff',
          boxShadow: disabled
            ? 'none'
            : '0 4px 16px rgba(0,122,255,0.35), 0 1px 3px rgba(0,122,255,0.20)',
        }}
        onMouseDown={(e) => {
          if (!disabled) e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Download className="w-4.5 h-4.5" strokeWidth={2.5} />
        {disabled
          ? 'Keine Ereignisse vorhanden'
          : `${eventCount} ${eventCount === 1 ? 'Ereignis' : 'Ereignisse'} herunterladen`}
      </button>
      {!disabled && (
        <p className="text-center text-[12px]" style={{ color: '#6E6E73' }}>
          Öffne die .ics-Datei auf iPhone oder Mac, um alle Termine zu importieren.
        </p>
      )}
    </div>
  );
}
