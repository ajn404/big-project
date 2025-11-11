import { createContext, useContext } from 'react'

interface FilterContextType {
  onFilterSelect?: (type: 'category' | 'tag', value: string) => void
}

const FilterContext = createContext<FilterContextType>({})

export const useFilter = () => useContext(FilterContext)

export const FilterProvider = FilterContext.Provider