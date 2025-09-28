import React from 'react'

interface LoadingSpinnerProps {
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = 'absolute flex items-center justify-center h-full w-full'
}) => {
  return (
    <div className={className}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
    </div>
  )
}
