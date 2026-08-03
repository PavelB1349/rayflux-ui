export const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 animate-pulse h-80 flex flex-col justify-between">
          <div className="w-full h-40 bg-zinc-800 rounded-xl" />
          <div className="space-y-2 my-4">
            <div className="h-4 bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
          <div className="h-10 bg-zinc-800 rounded-xl" />
        </div>
      ))}
    </div>
  )
}