import { EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons'
import Button from '../../../../components/ui/Button/Button'
import type { Skill } from '../../../../types/Skill'

interface SkillCardProps {
  skill: Skill
  deleting: boolean
  onEdit: (skill: Skill) => void
  onDelete: (id: string) => void
}

export function SkillCard({ skill, deleting, onEdit, onDelete }: SkillCardProps) {
  return (
    <div className="skill-card">
      {/* Image */}
      <div className="skill-card__image-wrap">
        {skill.image ? (
          <img
            className="skill-card__image"
            src={skill.image}
            alt={skill.name}
            loading="lazy"
          />
        ) : (
          <div className="skill-card__image-placeholder">
            <PictureOutlined />
          </div>
        )}
      </div>

      {/* Name */}
      <span className="skill-card__name">{skill.name}</span>

      {/* Actions */}
      <div className="skill-card__actions">
        <Button
          variant="ghost"
          size="sm"
          icon={<EditOutlined />}
          onClick={() => onEdit(skill)}
          title="Chỉnh sửa"
        />
        <Button
          variant="danger"
          size="sm"
          icon={<DeleteOutlined />}
          loading={deleting}
          onClick={() => onDelete(skill.id)}
          title="Xóa"
        />
      </div>
    </div>
  )
}
