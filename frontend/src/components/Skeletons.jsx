export const CardSkeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-ink-50" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-ink-50 rounded w-1/2" />
      <div className="h-3.5 bg-ink-50 rounded w-full" />
      <div className="h-3 bg-ink-50 rounded w-2/3" />
      <div className="h-3 bg-ink-50 rounded w-1/3 mt-3" />
    </div>
  </div>
);

export const GridSkeleton = ({ n = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {Array.from({ length: n }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);
