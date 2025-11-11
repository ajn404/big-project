import React from 'react'

interface PracticePageHeaderProps {
  hasFilters: boolean
  resultsCount: number
}

export const PracticePageHeader = React.memo(function PracticePageHeader({ 
  hasFilters, 
  resultsCount 
}: PracticePageHeaderProps) {
  return (
    <>
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold">实践项目</h1>
        <p className="text-xl text-muted-foreground mt-2">
          通过动手实践掌握现代Web开发技术
        </p>
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {hasFilters ? '搜索结果' : '所有项目'}
        </h2>
        <p className="text-muted-foreground">
          找到 {resultsCount} 个实践项目
        </p>
      </div>
    </>
  )
})