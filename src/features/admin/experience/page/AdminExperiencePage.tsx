import { useState } from 'react'
import {
  CalendarOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import { useExperienceQuery } from '../../../../hooks/useExperienceQuery'
import { useExperience } from '../hook/useExperience'
import { ExperienceCard } from '../components/ExperienceCard'
import { ExperienceModal } from '../components/ExperienceModal'
import Button from '../../../../components/ui/Button/Button'
import type { Experience, ExperienceFormData } from '../../../../types/Experience'

export default function AdminExperiencePage() {
  const {
    experiences,
    loading,
    refetch: fetchExperiences,
  } = useExperienceQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createExperience,
    updateExperience,
    deleteExperience,
    clearMessages,
  } = useExperience()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Experience | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (exp: Experience) => {
    setEditTarget(exp)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ExperienceFormData) => {
    const success = editTarget
      ? await updateExperience(editTarget.id, data)
      : await createExperience(data)

    if (success) handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa kinh nghiệm này?')) return
    await deleteExperience(id)
  }

  return (
    <div className="admin-experience-page">
      <div className="admin-experience-page__header">
        <div className="admin-experience-page__header-left">
          <div className="admin-experience-page__icon">
            <CalendarOutlined />
          </div>

          <div>
            <h1 className="admin-experience-page__title">Kinh nghiệm</h1>
            <p className="admin-experience-page__subtitle">
              Quản lý lịch sử và kinh nghiệm làm việc hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-experience-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchExperiences()}
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
            Thêm Kinh Nghiệm
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-experience-page__alert admin-experience-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-experience-page__alert admin-experience-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-experience-page__loading">
          <span className="admin-experience-page__spinner" />
          <span>Đang tải danh sách kinh nghiệm...</span>
        </div>
      ) : experiences.length === 0 ? (
        <div className="admin-experience-page__empty">
          <CalendarOutlined />
          <p>Chưa có kinh nghiệm làm việc nào. Hãy thêm kinh nghiệm đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Kinh Nghiệm
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-experience-page__count">{experiences.length} kinh nghiệm</p>

          <div className="admin-experience-page__list">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                deleting={deleting === exp.id}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <ExperienceModal
        open={modalOpen}
        editTarget={editTarget}
        saving={saving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
