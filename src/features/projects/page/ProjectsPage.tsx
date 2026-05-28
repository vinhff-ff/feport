import { useState, useEffect } from 'react'
import { SearchOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useProjectQuery } from '../../../hooks/useProjectQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import projectService from '../../admin/project/service/projectService'
import ProjectCard from '../../../components/ui/ProjectCard'
import Pagination from '../../../components/ui/Pagination'
import { paginateData, countProjects } from '../../../utils/projectHelpers'
import type { Project } from '../../../types/Project'
import '../style/ProjectsPage.scss'

const ProjectsPage =() => {
  const { projects = [], loading } = useProjectQuery()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const [searchedProject, setSearchedProject] = useState<Project | null>(null)
  const [localMatches, setLocalMatches] = useState<Project[] | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Clear states when query is wiped out manually
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedProject(null)
      setLocalMatches(null)
      setHasSearched(false)
      setCurrentPage(1)
    }
  }, [searchQuery])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) {
      setSearchedProject(null)
      setLocalMatches(null)
      setHasSearched(false)
      return
    }

    setSearchLoading(true)
    setHasSearched(true)
    setCurrentPage(1)

    try {
      // 1. Attempt to fetch exact project by name using the API `/get-project/:name`
      const exactProject = await projectService.getByName(query)
      if (exactProject) {
        setSearchedProject(exactProject)
        setLocalMatches(null)
      } else {
        triggerLocalFallback(query)
      }
    } catch {
      // 2. If API fails (e.g. 404), fall back to fuzzy local searching in projects array
      triggerLocalFallback(query)
    } finally {
      setSearchLoading(false)
    }
  }

  const triggerLocalFallback = (query: string) => {
    setSearchedProject(null)
    const lowerQuery = query.toLowerCase()
    const filtered = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    )
    setLocalMatches(filtered)
  }

  // Determine what list to render
  const getDisplayList = (): Project[] => {
    if (!hasSearched) return projects
    if (searchedProject) return [searchedProject]
    return localMatches || []
  }

  const displayList = getDisplayList()
  const totalCount = countProjects(displayList)
  const paginatedProjects = paginateData(displayList, currentPage, pageSize)

  return (
    <div className="projects-page">
      <div className="projects-page__container">
        
        {/* Search controls */}
        <form className="projects-page__search-box" onSubmit={handleSearch}>
          <div className="projects-page__search-input-wrap">
            <SearchOutlined className="projects-page__search-icon" />
            <input
              className="projects-page__search-input"
              placeholder={t('searchPlaceholder') || 'Tìm kiếm tên dự án hoặc mô tả...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="projects-page__search-btn"
            disabled={searchLoading}
          >
            {searchLoading ? <span className="projects-page__spinner" /> : <SearchOutlined />}
            <span>{t('searchBtn') || 'Tìm kiếm'}</span>
          </button>
        </form>

        {/* Content lists */}
        {loading ? (
          <div className="projects-page__loading">
            <span className="projects-page__spinner" />
            <span>{t('loadingProjects')}</span>
          </div>
        ) : paginatedProjects.length === 0 ? (
          <div className="projects-page__empty">
            <AppstoreOutlined />
            <p>{t('noProjects')}</p>
          </div>
        ) : (
          <>
            <div className="projects-page__grid">
              {paginatedProjects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>

            {/* Antd Pagination encapsulated in UI */}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

      </div>
    </div>
  )
}
export default ProjectsPage
