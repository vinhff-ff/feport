import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons'
import Button from '../../../../components/ui/Button/Button'
import type { Experience } from '../../../../types/Experience'

interface ExperienceCardProps {
  experience: Experience
  deleting: boolean
  onEdit: (experience: Experience) => void
  onDelete: (id: string) => void
}

export function ExperienceCard({
  experience,
  deleting,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  const displayDuration = () => {
    const end = experience.endDate && experience.endDate.trim() !== ''
      ? experience.endDate
      : 'Hiện tại'
    return `${experience.startDate} — ${end}`
  }

  return (
    <div className="experience-card">
      <div className="experience-card__icon-wrap">
        <CalendarOutlined />
      </div>

      <div className="experience-card__content">
        <h3 className="experience-card__name">{experience.name}</h3>
        <span className="experience-card__date">{displayDuration()}</span>
        <p className="experience-card__description">{experience.description}</p>
      </div>

      <div className="experience-card__actions">
        <Button
          variant="ghost"
          size="sm"
          icon={<EditOutlined />}
          onClick={() => onEdit(experience)}
          title="Chỉnh sửa"
        />
        <Button
          variant="danger"
          size="sm"
          icon={<DeleteOutlined />}
          loading={deleting}
          onClick={() => onDelete(experience.id)}
          title="Xóa"
        />
      </div>
    </div>
  )
}
