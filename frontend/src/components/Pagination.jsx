import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 rounded-lg border border-line flex items-center justify-center disabled:opacity-40 hover:bg-ink-50"
      >
        <ChevronLeft size={16} />
      </button>
      {nums.map((n, idx) => (
        <span key={n} className="flex items-center">
          {idx > 0 && nums[idx - 1] !== n - 1 && <span className="px-1 text-muted text-sm">…</span>}
          <button
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold ${
              n === page ? "bg-ink text-white" : "border border-line hover:bg-ink-50"
            }`}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 rounded-lg border border-line flex items-center justify-center disabled:opacity-40 hover:bg-ink-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
