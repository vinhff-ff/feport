import { Link } from 'react-router-dom'
import { BirdsBackground } from '../components/BirdsBackground.js'
import { useAdminProfile } from '../../admin/adminProfile/hook/useAdminProfile.js'
import { useProjectQuery } from '../../../hooks/useProjectQuery'
import { useTranslation } from '../../../i18n/useTranslation'
import Button from '../../../components/ui/Button/Button'

export default function HomePage1() {
  const { profile, loading } = useAdminProfile()
  const { projects = [] } = useProjectQuery()
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <div className="home-page__birds-zone">
        <BirdsBackground />
      </div>

      <div className="home-page__content">
        <span className="home-page__badge">
          {profile?.workStatus === 'READY' ? t('available') : t('unavailable')}
        </span>

        <h1 className="home-page__title">
          {loading ? '...' : (profile?.name ?? t('defaultName'))}
        </h1>

        <h2 className="home-page__role">
          {loading ? '...' : (profile?.position ?? t('defaultPosition'))}
        </h2>

        <div className="home-page__divider" />

        <p className="home-page__description">
          {loading ? '...' : (profile?.bio ?? t('defaultBio'))}
        </p>

        <div className="home-page__chips">
          {loading
            ? null
            : profile?.skills?.map((skill, index) => (
                <span key={index} className="home-page__chip">{skill}</span>
              ))
          }
        </div>

        {/* Project count indicator */}
        {!loading && projects.length > 0 && (
          <div className="home-page__stats">
            <span className="home-page__projects-count">
              {t('projectsCompleted').replace('{count}', String(projects.length))}
            </span>
          </div>
        )}

        {/* View Projects CTA */}
        <div className="home-page__cta">
          <Link to="/projects">
            <Button variant="primary" size="lg" borderRadius="var(--radius-full)" style={{ padding: '15px 30px' }}>
              {t('viewProjects')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}