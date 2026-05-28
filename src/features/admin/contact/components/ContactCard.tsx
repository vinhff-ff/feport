import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  LinkOutlined,
  FacebookOutlined,
  GithubOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import type { Contact } from '../../../../types/Contact'
import Button from '../../../../components/ui/Button/Button'

interface ContactCardProps {
  contact: Contact
  deleting: boolean
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
}

export function ContactCard({ contact, deleting, onEdit, onDelete }: ContactCardProps) {
  const getContactIcon = (name: string) => {
    const lowercaseName = name.toLowerCase()
    if (lowercaseName.includes('facebook') || lowercaseName.includes('fb')) {
      return <FacebookOutlined />
    }
    if (lowercaseName.includes('github') || lowercaseName.includes('git')) {
      return <GithubOutlined />
    }
    if (lowercaseName.includes('linkedin') || lowercaseName.includes('in')) {
      return <LinkedinOutlined />
    }
    if (lowercaseName.includes('mail') || lowercaseName.includes('email') || lowercaseName.includes('@')) {
      return <MailOutlined />
    }
    if (lowercaseName.includes('phone') || lowercaseName.includes('sđt') || lowercaseName.includes('tel')) {
      return <PhoneOutlined />
    }
    if (lowercaseName.includes('web') || lowercaseName.includes('site') || lowercaseName.includes('global')) {
      return <GlobalOutlined />
    }
    return <LinkOutlined />
  }

  return (
    <div className="contact-card">
      <div className="contact-card__icon-wrap">
        {getContactIcon(contact.name)}
      </div>

      <div className="contact-card__content">
        <h3 className="contact-card__name">{contact.name}</h3>
        <a
          href={contact.link.startsWith('http') || contact.link.includes('@') ? contact.link : `https://${contact.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card__link"
        >
          {contact.link}
        </a>
      </div>

      <div className="contact-card__actions">
        <Button
          variant="secondary"
          size="sm"
          icon={<EditOutlined />}
          onClick={() => onEdit(contact)}
          disabled={deleting}
        />

        <Button
          variant="danger"
          size="sm"
          icon={deleting ? <LoadingOutlined /> : <DeleteOutlined />}
          onClick={() => onDelete(contact.id)}
          disabled={deleting}
        />
      </div>
    </div>
  )
}
