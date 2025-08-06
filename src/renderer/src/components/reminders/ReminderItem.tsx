// renderer/src/components/reminders/ReminderItem.tsx
import React, { useState } from 'react'
import { List, Checkbox, Button, Typography, Space, Tag, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Reminder } from '@renderer/types/reminders'
import dayjs from 'dayjs'
import ReminderForm from './ReminderForm'

const { Text } = Typography

interface ReminderItemProps {
  reminder: Reminder
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  onEdit: (id: string, data: Omit<Reminder, 'id' | 'completed'>) => void
}

const ReminderItem: React.FC<ReminderItemProps> = ({
                                                     reminder,
                                                     onDelete,
                                                     onToggleComplete,
                                                     onEdit
                                                   }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const getRepeatText = (repeat: Reminder['repeat']) => {
    switch (repeat) {
      case 'minutely':
        return '每分钟'
      case 'halfHourly':
        return '每半小时'
      case 'hourly':
        return '每小时'
      case 'daily':
        return '每天'
      default:
        return ''
    }
  }

  const handleEdit = (data: Omit<Reminder, 'id' | 'completed'>) => {
    onEdit(reminder.id, data)
    setIsModalVisible(false)
  }

  const showDetail = () => {
    Modal.info({
      title: reminder.title,
      content: (
        <div>
          <p>{reminder.content}</p>
          <p>提醒时间: {dayjs(reminder.date).format('YYYY-MM-DD HH:mm')}</p>
          {reminder.repeat !== 'none' && <p>重复周期: {getRepeatText(reminder.repeat)}</p>}
        </div>
      ),
      onOk() {}
    })
  }

  return (
    <>
      <List.Item
        actions={[
          <Button type="text" icon={<EyeOutlined />} onClick={showDetail} />,
          <Button type="text" icon={<EditOutlined />} onClick={() => setIsModalVisible(true)} />,
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(reminder.id)}
          />
        ]}
      >
        <List.Item.Meta
          title={
            <Space>
              <Checkbox
                checked={reminder.completed}
                onChange={() => onToggleComplete(reminder.id)}
              />
              <Text delete={reminder.completed}>{reminder.title}</Text>
              {reminder.repeat !== 'none' && (
                <Tag color="blue">{getRepeatText(reminder.repeat)}</Tag>
              )}
            </Space>
          }
          description={dayjs(reminder.date).format('YYYY-MM-DD HH:mm')}
        />
      </List.Item>

      <Modal
        title="编辑提醒事项"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ReminderForm onSubmit={handleEdit} />
      </Modal>
    </>
  )
}

export default ReminderItem
