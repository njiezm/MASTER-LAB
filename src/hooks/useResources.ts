import { useState, useEffect } from 'react'

interface Resource {
  id: string
  title: string
  type: 'pdf' | 'note' | 'video' | 'audio' | 'image' | 'link' | 'code'
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  favorite: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

interface UseResourcesReturn {
  resources: Resource[]
  loading: boolean
  error: string | null
  fetchResources: (filters?: { type?: string; search?: string; favorite?: boolean }) => Promise<void>
  createResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Resource | null>
  updateResource: (id: string, updates: Partial<Resource>) => Promise<Resource | null>
  deleteResource: (id: string) => Promise<boolean>
  exportResources: (format?: 'csv' | 'json') => Promise<void>
  importResources: (file: File) => Promise<{ imported: number; resources: Resource[] } | null>
}

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async (filters?: { type?: string; search?: string; favorite?: boolean }) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.type && filters.type !== 'all') {
        params.append('type', filters.type)
      }
      if (filters?.search) {
        params.append('search', filters.search)
      }
      if (filters?.favorite) {
        params.append('favorite', 'true')
      }

      const response = await fetch(`/api/resources?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setResources(data.data)
      } else {
        setError(data.error || 'Failed to fetch resources')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const createResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resource),
      })

      const data = await response.json()

      if (data.success) {
        setResources(prev => [...prev, data.data])
        return data.data
      } else {
        setError(data.error || 'Failed to create resource')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating resource:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/resources', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updates }),
      })

      const data = await response.json()

      if (data.success) {
        setResources(prev => 
          prev.map(r => r.id === id ? data.data : r)
        )
        return data.data
      } else {
        setError(data.error || 'Failed to update resource')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating resource:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteResource = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/resources?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setResources(prev => prev.filter(r => r.id !== id))
        return true
      } else {
        setError(data.error || 'Failed to delete resource')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting resource:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const exportResources = async (format: 'csv' | 'json' = 'csv') => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/export?format=${format}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `masterlab-export-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Failed to export resources')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error exporting resources:', err)
    } finally {
      setLoading(false)
    }
  }

  const importResources = async (file: File) => {
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        await fetchResources() // Recharger les ressources
        return data.data
      } else {
        setError(data.error || 'Failed to import resources')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error importing resources:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return {
    resources,
    loading,
    error,
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    exportResources,
    importResources,
  }
}