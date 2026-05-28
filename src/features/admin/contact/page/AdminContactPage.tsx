import { useState } from 'react'
import {
  ContactsOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

import { useContactQuery } from '../../../../hooks/useContactQuery'
import { useContact } from '../hook/useContact'
import { ContactCard } from '../components/ContactCard'
import { ContactModal } from '../components/ContactModal'
import Button from '../../../../components/ui/Button/Button'
import type { Contact, ContactFormData } from '../../../../types/Contact'

export default function AdminContactPage() {
  const {
    contacts = [],
    loading,
    refetch: fetchContacts,
  } = useContactQuery()

  const {
    saving,
    deleting,
    error,
    successMsg,
    createContact,
    updateContact,
    deleteContact,
    clearMessages,
  } = useContact()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Contact | null>(null)

  const handleOpenCreate = () => {
    setEditTarget(null)
    clearMessages()
    setModalOpen(true)
  }

  const handleOpenEdit = (contact: Contact) => {
    setEditTarget(contact)
    clearMessages()
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditTarget(null)
  }

  const handleSubmit = async (data: ContactFormData) => {
    const success = editTarget
      ? await updateContact(editTarget.id, data)
      : await createContact(data)

    if (success) handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return
    await deleteContact(id)
  }

  return (
    <div className="admin-contact-page">
      <div className="admin-contact-page__header">
        <div className="admin-contact-page__header-left">
          <div className="admin-contact-page__icon">
            <ContactsOutlined />
          </div>

          <div>
            <h1 className="admin-contact-page__title">Liên hệ</h1>
            <p className="admin-contact-page__subtitle">
              Quản lý các mạng xã hội và phương thức liên lạc hiển thị trên portfolio
            </p>
          </div>
        </div>

        <div className="admin-contact-page__header-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<ReloadOutlined />}
            onClick={() => fetchContacts()}
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
            Thêm Liên Hệ
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="admin-contact-page__alert admin-contact-page__alert--success">
          <CheckCircleOutlined />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="admin-contact-page__alert admin-contact-page__alert--error">
          <CloseCircleOutlined />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-contact-page__loading">
          <span className="admin-contact-page__spinner" />
          <span>Đang tải danh sách liên hệ...</span>
        </div>
      ) : contacts.length === 0 ? (
        <div className="admin-contact-page__empty">
          <ContactsOutlined />
          <p>Chưa có phương thức liên hệ nào. Hãy thêm liên hệ đầu tiên!</p>

          <Button
            variant="primary"
            size="md"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
          >
            Thêm Liên Hệ
          </Button>
        </div>
      ) : (
        <>
          <p className="admin-contact-page__count">{contacts.length} liên hệ</p>

          <div className="admin-contact-page__list">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                deleting={deleting === contact.id}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      <ContactModal
        open={modalOpen}
        editTarget={editTarget}
        saving={saving}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
