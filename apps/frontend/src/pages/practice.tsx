import { useState, useCallback, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { FilterProvider } from '@/contexts/filter-context'
import { PracticeGrid } from '@/components/practice-grid'
import { PracticeFilters } from '@/components/practice-filters'
import { PracticePageHeader } from '@/components/practice-page-header'
import { PracticeSearchBar } from '@/components/practice-search-bar'
import { useSearchPracticeNodes } from '@/hooks/useSearchPracticeNodes'

export function PracticePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleExternalFilter = useCallback((type: 'category' | 'tag', value: string) => {
    flushSync(() => {
      if (type === 'category') {
        setSelectedCategory(value)
        setSearchQuery('')
        setSelectedTags([])
      } else {
        setSelectedTags([value])
        setSearchQuery('')
        setSelectedCategory('')
      }
    })
  }, [])

  const filterContextValue = useMemo(
    () => ({ onFilterSelect: handleExternalFilter }),
    [handleExternalFilter]
  )

  const { results: practiceNodes, loading, error } = useSearchPracticeNodes(searchQuery, {
    category: selectedCategory,
    tags: selectedTags,
    debounceMs: 500,
  })

  const hasFilters = !!(searchQuery || selectedCategory || selectedTags.length)

  return (
    <FilterProvider value={filterContextValue}>
      <div className="space-y-8">
        <PracticePageHeader hasFilters={hasFilters} resultsCount={practiceNodes.length} />
        <div className="space-y-6">
          <PracticeSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <PracticeFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-lg">
              <div className="flex items-center space-x-2 bg-background px-4 py-2 rounded-lg shadow-lg">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">搜索中...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">搜索出错：{error.message}</p>
            </div>
          )}

          <PracticeGrid items={practiceNodes} />
        </div>
      </div>
    </FilterProvider>
  )
}
