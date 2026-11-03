/**
 * Shown while a dashboard route's code or data is being fetched on navigation: a skeleton in the shape of a typical screen (a hero card,
 * then a grid of cards) instead of a spinner, so the page feels like it is already there and nothing jumps when it arrives.
 * Full width like every screen; the shimmer is switched off for "reduce motion" by .skeleton-shimmer itself.
 */
export default function DashboardLoading() {
  return (
    <div className="w-full space-y-4" role="status" aria-label="Loading" aria-busy="true">
      <div className="skeleton-shimmer h-40 w-full rounded-3xl sm:h-48" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-20 rounded-2xl" />)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton-shimmer h-44 rounded-3xl" />)}
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
