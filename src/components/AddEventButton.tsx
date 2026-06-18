import { Plus } from 'lucide-react';

interface AddEventButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddEventButton({ onClick, disabled }: AddEventButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 font-semibold rounded-2xl px-4 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
      style={{
        background: 'linear-gradient(135deg, #007AFF 0%, #0055D4 100%)',
        color: '#fff',
        height: '52px',
        fontSize: '16px',
        boxShadow: '0 2px 8px rgba(0,122,255,0.30), 0 1px 2px rgba(0,122,255,0.20)',
      }}
      onMouseDown={(e) => { (e.currentTarget.style.transform = 'scale(0.98)'); }}
      onMouseUp={(e) => { (e.currentTarget.style.transform = 'scale(1)'); }}
      onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
      </div>
      Ereignis hinzufügen
    </button>
  );
}
