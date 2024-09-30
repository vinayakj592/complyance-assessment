import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

export default LoadingSpinner