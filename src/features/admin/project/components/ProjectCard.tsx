import { EditOutlined, DeleteOutlined, PictureOutlined, GithubOutlined, LinkOutlined } from '@ant-design/icons'
import Button from '../../../../components/ui/Button/Button'
import type { Project } from '../../../../types/Project'

interface ProjectCardProps {
  project: Project
  deleting: boolean
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ project, deleting, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="admin-project-card">
      {/* Cover Image */}
      <div className="admin-project-card__image-wrap">
        {project.image ? (
          <img
            className="admin-project-card__image"
            src={project.image}
            alt={project.name}
            loading="lazy"
          />
        ) : (
          <div className="admin-project-card__image-placeholder">
            <PictureOutlined />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="admin-project-card__info">
        <h3 className="admin-project-card__name">{project.name}</h3>
        <p className="admin-project-card__desc">{project.description}</p>
        
        {/* Links */}
        <div className="admin-project-card__links">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="admin-project-card__link">
              <GithubOutlined /> <span>GitHub</span>
            </a>
          )}
          {project.productLink && (
            <a href={project.productLink} target="_blank" rel="noopener noreferrer" className="admin-project-card__link admin-project-card__link--demo">
              <LinkOutlined /> <span>Demo</span>
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="admin-project-card__actions">
        <Button
          variant="ghost"
          size="sm"
          icon={<EditOutlined />}
          onClick={() => onEdit(project)}
          title="Chỉnh sửa"
        />
        <Button
          variant="danger"
          size="sm"
          icon={<DeleteOutlined />}
          loading={deleting}
          onClick={() => onDelete(project.id)}
          title="Xóa"
        />
      </div>
    </div>
  )
}
export default ProjectCard
