import { useState } from 'react'
import {
  TrophyOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import { useSkillsQuery } from '../../../../hooks/useSkillsQuery'
import { useSkills } from '../hook/useSkills'
import { SkillCard } from '../components/SkillCard'
import { SkillModal } from '../components/SkillModal'
import Button from '../../../../components/ui/Button/Button'
import type { Skill, SkillFormData } from '../../../../types/Skill'

export default function AdminSkillsPage() {
  const {
    skills,
    loading,
    refetch: fetchSkills,
  } = useSkillsQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createSkill,
    updateSkill,
    deleteSkill,
    clearMessages,
  } = useSkills()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Skill | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (skill: Skill) => {
    setEditTarget(skill)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: SkillFormData) => {
    const success = editTarget
      ? await updateSkill(editTarget.id, data)
      : await createSkill(data)

    if (success) handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa skill này?')) return
    await deleteSkill(id)
  }

  return (
    <div className="admin-skills-page">
      <div className="admin-skills-page__header">
        <div className="admin-skills-page__header-left">
          <div className="admin-skills-page__icon">
            <TrophyOutlined />
          </div>

          <div>
            <h1 className="admin-skills-page__title">Kỹ năng</h1>
            <p className="admin-skills-page__subtitle">
              Quản lý danh sách kỹ năng hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-skills-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchSkills()}
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
            Thêm Skill
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-skills-page__alert admin-skills-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-skills-page__alert admin-skills-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-skills-page__loading">
          <span className="admin-skills-page__spinner" />
          <span>Đang tải danh sách kỹ năng...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="admin-skills-page__empty">
          <TrophyOutlined />
          <p>Chưa có kỹ năng nào. Hãy thêm kỹ năng đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Skill
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-skills-page__count">{skills.length} kỹ năng</p>

          <div className="admin-skills-page__grid">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                deleting={deleting === skill.id}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <SkillModal
        open={modalOpen}
        editTarget={editTarget}
        saving={saving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}