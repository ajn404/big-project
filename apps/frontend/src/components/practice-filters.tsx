import { useQuery } from '@apollo/client'
import { GET_CATEGORIES, GET_TAGS } from '@/lib/graphql/queries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface PracticeFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function PracticeFilters({
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
}: PracticeFiltersProps) {
  const { data: categoriesData } = useQuery(GET_CATEGORIES)
  const { data: tagsData } = useQuery(GET_TAGS)

  const categories = categoriesData?.categories || []
  const tags = tagsData?.tags || []

  const handleCategoryClick = (categoryName: string) => {
    onCategoryChange(selectedCategory === categoryName ? '' : categoryName)
  }

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  const clearAllFilters = () => {
    onCategoryChange('')
    onTagsChange([])
  }

  const hasFilters = selectedCategory || selectedTags.length > 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>筛选条件</CardTitle>
            <CardDescription>
              根据分类和标签筛选实践项目
            </CardDescription>
          </div>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">分类</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category: any) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  style={selectedCategory === category.name ? {
                    backgroundColor: category.color,
                    borderColor: category.color,
                    color: 'white'
                  } : {
                    borderColor: category.color,
                    color: category.color
                  }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.name}
                  {category.practiceNodes && (
                    <span className="ml-1">({category.practiceNodes.length})</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">标签</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 20).map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleTagClick(tag.name)}
                >
                  {tag.name}
                  {tag.practiceNodes && (
                    <span className="ml-1">({tag.practiceNodes.length})</span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active filters summary */}
        {hasFilters && (
          <div>
            <h3 className="font-semibold mb-3">当前筛选</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  分类: {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onCategoryChange('')}
                  />
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleTagClick(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}