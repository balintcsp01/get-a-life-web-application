// Reusable skeleton primitives built on DaisyUI's skeleton utility

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`skeleton ${width} ${height} rounded`} />;
}

export function SkeletonHobbyCard() {
  return (
    <div className="card w-full overflow-hidden rounded-2xl bg-base-100 shadow-md">
      <div className="skeleton h-44 w-full rounded-none" />
      <div className="card-body gap-3 p-5">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="flex items-center justify-between mt-1">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHobbyGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonHobbyCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHobbyDetails() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="skeleton w-full h-72 md:h-96 rounded-none" />

      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 pb-16">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body gap-5">
            <div className="flex items-start justify-between gap-3">
              <div className="skeleton h-10 w-2/3 rounded" />
              <div className="skeleton h-12 w-12 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
            <div className="skeleton h-8 w-40 rounded" />
            <div className="skeleton h-px w-full" />
            {/* Description */}
            <div className="flex flex-col gap-2">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonHobbyTableRows({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i}>
      <td><div className="skeleton h-4 w-28 rounded" /></td>
      <td><div className="skeleton h-5 w-16 rounded-full" /></td>
      <td><div className="skeleton h-5 w-20 rounded-full" /></td>
      <td><div className="skeleton h-4 w-20 rounded" /></td>
      <td>
        <div className="flex justify-end gap-2">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </td>
    </tr>
  ));
}

export function SkeletonCategoryList({ count = 6 }) {
  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-base-200 border-b border-base-300">
        <div className="skeleton h-4 w-32 rounded" />
      </div>
      <ul>
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            className={`flex items-center justify-between px-4 py-3 ${i < count - 1 ? 'border-b border-base-200' : ''}`}
          >
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-6 w-14 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkeletonSuggestionCards({ count = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-200 border border-base-300 shadow-sm">
          <div className="card-body py-4 px-6 flex-row items-center justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="flex gap-2 mt-1">
                <div className="skeleton h-5 w-16 rounded-full" />
                <div className="skeleton h-5 w-20 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <div className="skeleton h-8 w-20 rounded" />
              <div className="skeleton h-8 w-16 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonFilterBar() {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className={`skeleton h-8 rounded-lg ${i === 0 ? 'w-12' : 'w-20'}`} />
      ))}
    </div>
  );
}
