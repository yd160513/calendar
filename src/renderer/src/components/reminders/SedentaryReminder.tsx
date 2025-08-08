// renderer/src/components/reminders/SedentaryReminder.tsx
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Button, Modal, Form, InputNumber, Input, message } from 'antd';
import dayjs from 'dayjs';

interface SedentaryReminderProps {
  onReminderTrigger: (content: string) => void;
}

export interface SedentaryReminderRef {
  handleRestartReminder: () => void;
}

const SedentaryReminder: React.ForwardRefRenderFunction<SedentaryReminderRef, SedentaryReminderProps> = (
  { onReminderTrigger },
  ref
) => {
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(1);
  const [reminderContent, setReminderContent] = useState('您已经久坐一段时间了，请起身活动一下！');
  const [form] = Form.useForm();

  const [nextReminderTime, setNextReminderTime] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isReminderActive && nextReminderTime && !isPaused) {
      const now = Date.now();
      const timeToNextReminder = nextReminderTime - now;

      if (timeToNextReminder > 0) {
        timer = setTimeout(() => {
          onReminderTrigger(reminderContent);
          // 暂停计时器而不是自动设置下次提醒
          setIsPaused(true);
        }, timeToNextReminder);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isReminderActive, nextReminderTime, isPaused, reminderContent, onReminderTrigger]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    handleRestartReminder
  }));

  const handleStartReminder = () => {
    setIsSettingModalVisible(true);
  };

  const handleStopReminder = () => {
    setIsReminderActive(false);
    setNextReminderTime(null);
    setIsPaused(false);
    message.success('久坐提醒已停止');
  };

  const handleSettingSubmit = (values: { interval: number; content: string }) => {
    setIntervalMinutes(values.interval);
    setReminderContent(values.content);

    // 立即设置下一次提醒时间
    const nextTime = Date.now() + values.interval * 60 * 1000;
    setNextReminderTime(nextTime);
    setIsPaused(false); // 确保不是暂停状态

    setIsReminderActive(true);
    setIsSettingModalVisible(false);
    message.success(`久坐提醒已启动，每隔${values.interval}分钟提醒一次`);
  };

  // 处理用户点击"再次开始"按钮
  const handleRestartReminder = () => {
    const nextTime = Date.now() + intervalMinutes * 60 * 1000;
    setNextReminderTime(nextTime);
    setIsPaused(false); // 取消暂停状态
  };

  return (
    <>
      <Button
        type={isReminderActive ? "default" : "primary"}
        onClick={isReminderActive ? handleStopReminder : handleStartReminder}
        danger={isReminderActive}
      >
        {isReminderActive ? "停止久坐提醒" : "启动久坐提醒"}
      </Button>

      <Modal
        title="设置久坐提醒"
        open={isSettingModalVisible}
        onCancel={() => setIsSettingModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSettingSubmit}
          initialValues={{
            interval: intervalMinutes,
            content: reminderContent
          }}
        >
          <Form.Item
            name="interval"
            label="提醒间隔（分钟）"
            rules={[{ required: true, message: '请输入提醒间隔' }]}
          >
            <InputNumber min={1} max={120} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="content"
            label="提醒内容"
            rules={[{ required: true, message: '请输入提醒内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入提醒内容" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default forwardRef(SedentaryReminder);
