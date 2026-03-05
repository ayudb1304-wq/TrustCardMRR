import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-base-200 p-4 w-full max-w-full overflow-x-hidden">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body items-center text-center">
          <span className="text-6xl font-extrabold text-base-content/10">
            404
          </span>
          <h2 className="card-title mt-2">Page not found</h2>
          <p className="text-base-content/60">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link href="/" className="btn btn-primary btn-sm mt-4">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
