import { useCallback, useMemo, useState } from 'react'
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns'

interface UseDataPageFiltersParams<T> {
    data: T[]
    dateFieldKey: keyof T
    categoryFieldKey: keyof T
    searchFieldKey: keyof T
}

export function useDataPageFilters<T>({
    data,
    dateFieldKey,
    categoryFieldKey,
    searchFieldKey,
}: UseDataPageFiltersParams<T>) {
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    const categoryOptions = useMemo(() => {
        const cats = new Set<string>()
        data.forEach((item) => {
            const val = item[categoryFieldKey]
            if (typeof val === 'string' && val.trim() !== '') {
                cats.add(val)
            }
        })
        return Array.from(cats).sort()
    }, [data, categoryFieldKey])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (searchTerm.trim() !== '') count++
        if (categoryFilter !== null) count++
        if (startDate !== null) count++
        if (endDate !== null) count++
        return count
    }, [searchTerm, categoryFilter, startDate, endDate])

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (searchTerm.trim() !== '') {
                const field = item[searchFieldKey]
                if (typeof field !== 'string') return false
                if (!field.toLowerCase().includes(searchTerm.toLowerCase())) return false
            }

            if (categoryFilter && item[categoryFieldKey] !== categoryFilter) {
                return false
            }

            if (startDate || endDate) {
                const dateField = item[dateFieldKey]
                if (!dateField) return false
                let itemDate: Date
                try {
                    itemDate = parseISO(dateField as string)
                } catch {
                    return false
                }
                if (startDate && !endDate) {
                    if (itemDate < startOfDay(startDate)) return false
                } else if (!startDate && endDate) {
                    if (itemDate > endOfDay(endDate)) return false
                } else if (startDate && endDate) {
                    if (!isWithinInterval(itemDate, {
                        start: startOfDay(startDate),
                        end: endOfDay(endDate),
                    })) {
                        return false
                    }
                }
            }
            return true
        })
    }, [data, searchTerm, categoryFilter, startDate, endDate, dateFieldKey, categoryFieldKey, searchFieldKey])

    const clearFilters = useCallback(() => {
        setSearchTerm('')
        setCategoryFilter(null)
        setStartDate(null)
        setEndDate(null)
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        categoryOptions,
        activeFilterCount,
        filteredData,
        clearFilters,
    }
}