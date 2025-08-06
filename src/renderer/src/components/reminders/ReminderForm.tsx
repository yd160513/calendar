// renderer/src/components/reminders/ReminderForm.tsx
import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Space, Checkbox } from 'antd';
import { ReminderFormData } from '@renderer/types/reminders';
import dayjs from 'dayjs';

const { Option } = Select;

interface ReminderFormProps {
  onSubmit: (data: Omit<ReminderFormData, 'id' | 'completed'>) => void;
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasTime, setHasTime] = useState(false);

  const handleSubmit = (values: ReminderFormData) => {
    setLoading(true);
    onSubmit({
      title: values.title,
      content: values.content,
      date: values.date,
      repeat: values.repeat,
      hasTime: values.hasTime
    });
    form.resetFields();
    setLoading(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        repeat: 'none',
        date: dayjs().add(1, 'minute'),
        hasTime: false
      }}
    >
      <Form.Item
        name="title"
        label="提醒标题"
        rules={[{ required: true, message: '请输入提醒标题' }]}
      >
        <Input placeholder="请输入提醒标题" />
      </Form.Item>

      <Form.Item
        name="content"
        label="提醒内容"
      >
        <Input.TextArea placeholder="请输入提醒内容" rows={3} />
      </Form.Item>

      <Form.Item
        name="date"
        label="提醒日期"
        rules={[{ required: true, message: '请选择提醒日期' }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item name="hasTime" valuePropName="checked">
        <Checkbox onChange={(e) => setHasTime(e.target.checked)}>
          指定提醒时间
        </Checkbox>
      </Form.Item>

      {hasTime && (
        <Form.Item name="time" label="提醒时间">
          <DatePicker.TimePicker format="HH:mm" />
        </Form.Item>
      )}

      <Form.Item name="repeat" label="重复周期">
        <Select>
          <Option value="none">不重复</Option>
          <Option value="minutely">每分钟</Option>
          <Option value="halfHourly">每半小时</Option>
          <Option value="hourly">每小时</Option>
          <Option value="daily">每天</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            确认
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ReminderForm;
