import { useState } from 'react'
import {
  AppstoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import { useProjectQuery } from '../../../../hooks/useProjectQuery'
import { useProject } from '../hook/useProject'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import Button from '../../../../components/ui/Button/Button'
import type { Project, ProjectFormData } from '../../../../types/Project'

export default function AdminProjectPage() {
  const {
    projects,
    loading,
    refetch: fetchProjects,
  } = useProjectQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createProject,
    updateProject,
    deleteProject,
    clearMessages,
  } = useProject()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Project | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (project: Project) => {
    setEditTarget(project)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ProjectFormData) => {
    const success = editTarget
      ? await updateProject(editTarget.id, data)
      : await createProject(data)

    if (success) handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa dự án này?')) return
    await deleteProject(id)
  }

  return (
    <div className="admin-project-page">
      <div className="admin-project-page__header">
        <div className="admin-project-page__header-left">
          <div className="admin-project-page__icon">
            <AppstoreOutlined />
          </div>

          <div>
            <h1 className="admin-project-page__title">Dự án</h1>
            <p className="admin-project-page__subtitle">
              Quản lý danh sách sản phẩm, dự án cá nhân hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-project-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchProjects()}
            disabled={loading}
          >
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Dự án
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-project-page__alert admin-project-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-project-page__alert admin-project-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-project-page__loading">
          <span className="admin-project-page__spinner" />
          <span>Đang tải danh sách dự án...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-project-page__empty">
          <AppstoreOutlined />
          <p>Chưa có dự án nào. Hãy thêm dự án đầu tiên của bạn!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Dự án
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-project-page__count">{projects.length} dự án</p>

          <div className="admin-project-page__grid">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                deleting={deleting === proj.id}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <ProjectModal
        open={modalOpen}
        editTarget={editTarget}
        saving={saving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
