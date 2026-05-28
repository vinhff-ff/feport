import { TrophyOutlined } from '@ant-design/icons'
import { useSkillsQuery } from '../../../hooks/useSkillsQuery'
import { useTranslation } from '../../../i18n/useTranslation'

export default function HomePage2() {
  const { skills = [], loading } = useSkillsQuery()
  const { t } = useTranslation()

  return (
    <div className="home-page-2">
      <div className="home-page-2__content">
        <span className="home-page-2__badge">
          {t('skillsBadge')}
        </span>

        <h2 className="home-page-2__title">
          {t('skillsTitle')}
        </h2>
        <p className="home-page-2__subtitle">
          {t('skillsSubtitle')}
        </p>

        {loading ? (
          <div className="home-page-2__loading">
            <span className="home-page-2__spinner" />
            <span>{t('loadingSkills')}</span>
          </div>
        ) : skills.length === 0 ? (
          <div className="home-page-2__empty">
            <TrophyOutlined />
            <p>{t('noSkills')}</p>
          </div>
        ) : (
          <div className="home-page-2__skills-grid">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="home-page-2__skill-card"
                style={{ '--skill-index': index } as React.CSSProperties}
              >
                <div className="home-page-2__skill-icon-wrap">
                  {skill.image ? (
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="home-page-2__skill-img"
                    />
                  ) : (
                    <TrophyOutlined className="home-page-2__skill-icon" />
                  )}
                </div>
                <span className="home-page-2__skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
