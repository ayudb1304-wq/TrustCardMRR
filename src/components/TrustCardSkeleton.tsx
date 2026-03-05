const DEFAULT_SKELETON_WIDTH = 400;

export default function TrustCardSkeleton({ width }: { width?: number }) {
  const w = width ?? DEFAULT_SKELETON_WIDTH;
  return (
    <div
      className="animate-pulse rounded-2xl bg-base-300 w-full"
      style={{
        maxWidth: w,
        aspectRatio: "1.586 / 1",
      }}
      role="status"
      aria-label="Loading TrustCard"
    >
      <div className="flex h-full flex-col justify-between p-8">
        <div className="flex justify-end">
          <div className="h-10 w-10 rounded-lg bg-base-content/10" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-6 w-40 rounded bg-base-content/10" />
          <div className="h-8 w-32 rounded bg-base-content/10" />
          <div className="h-5 w-48 rounded bg-base-content/10" />
          <div className="mt-2 h-px w-full bg-base-content/5" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-36 rounded bg-base-content/10" />
            <div className="h-4 w-28 rounded bg-base-content/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
