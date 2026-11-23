/** A quiet placeholder while a screen of this section loads: the section's bars stay where they are and nothing flashes, so moving between its screens does not feel like leaving the page. */
export default function Loading() {
  return <div className="min-h-[60vh] w-full" role="status" aria-busy="true"><span className="sr-only">Loading</span></div>;
}
