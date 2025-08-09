export default function Loading() {
  return (
    <div className='p-10 bg-gray-50 min-h-screen'>
      <div className='flex items-center justify-between mb-6'>
        <div className='h-8 bg-gray-200 rounded w-32 animate-pulse'></div>
        <div className='h-10 bg-gray-200 rounded w-24 animate-pulse'></div>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='h-32 bg-gray-200 rounded animate-pulse'></div>
        ))}
      </div>
    </div>
  )
}