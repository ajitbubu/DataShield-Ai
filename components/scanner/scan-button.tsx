type ScanButtonProps = {
  onClick: () => void;
  loading: boolean;
};

export function ScanButton({ onClick, loading }: ScanButtonProps) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#17215f] disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
      type="button"
      disabled={loading}
    >
      {loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
      {loading ? "Scanning..." : "Scan Now"}
    </button>
  );
}
