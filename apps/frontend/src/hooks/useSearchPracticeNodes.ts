// src/hooks/useSearchPracticeNodes.ts
import { useMemo, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { useDebounce } from 'use-debounce'
import { SEARCH_PRACTICE_NODES } from '@/lib/graphql/queries'

interface SearchOptions {
    category?: string
    tags?: string[]
    debounceMs?: number
    skip?: boolean
}

export function useSearchPracticeNodes(
    rawQuery: string,
    options: SearchOptions = {}
) {
    const {
        category = '',
        tags = [],
        debounceMs = 500,
        skip = false,
    } = options

    // 🧠 1. 防抖搜索词
    const [debouncedQuery] = useDebounce(rawQuery, debounceMs)

    // 🧩 2. 构造查询参数（useMemo 缓存，防止对象变化导致重新请求）
    const queryVariables = useMemo(() => ({
        query: debouncedQuery || undefined,
        categoryName: category || undefined,
        tagNames: tags.length > 0 ? tags : undefined,
    }), [debouncedQuery, category, tags])

    // 🔍 3. GraphQL 查询（Apollo Client）
    const { data, loading, error } = useQuery(SEARCH_PRACTICE_NODES, {
        variables: queryVariables,
        skip,
        fetchPolicy: 'cache-first',
        notifyOnNetworkStatusChange: false,
    })

    // 💾 4. 缓存上次结果，避免加载时闪烁
    const previousResultsRef = useRef<any[]>([])

    const results = useMemo(() => {
        const current = data?.searchPracticeNodes || []

        if (loading && current.length === 0 && previousResultsRef.current.length > 0) {
            // 保留旧结果避免闪烁
            return previousResultsRef.current
        }

        if (current.length > 0) {
            previousResultsRef.current = current
            return current
        }

        if (!loading && current.length === 0) {
            previousResultsRef.current = []
            return []
        }

        return current
    }, [data?.searchPracticeNodes, loading])

    // 🌀 5. 控制加载状态，只在无缓存时显示 loading 动画
    const showLoading = useMemo(() => {
        return loading && previousResultsRef.current.length === 0
    }, [loading])

    return {
        results,
        loading: showLoading,
        rawLoading: loading,
        error,
    }
}
