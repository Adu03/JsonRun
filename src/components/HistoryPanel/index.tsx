import React, { useState, useCallback } from 'react';
import { Card, List, Button, Empty, Popconfirm, message, Input } from 'antd';
import { DeleteOutlined, EditOutlined, ClearOutlined } from '@ant-design/icons';
import type { HistoryItem } from '../../utils/storageUtils';
import { deleteHistoryItem, clearAllHistory, updateHistoryName } from '../../utils/storageUtils';

interface HistoryPanelProps {
  history: HistoryItem[];
  onHistorySelect: (item: HistoryItem) => void;
  onHistoryUpdate: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onHistorySelect, 
  onHistoryUpdate 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  // 处理历史记录选择
  const handleSelect = useCallback((item: HistoryItem) => {
    onHistorySelect(item);
  }, [onHistorySelect]);

  // 处理删除单条记录
  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      deleteHistoryItem(id);
      message.success('删除成功');
      onHistoryUpdate();
    } catch (error) {
      message.error('删除失败');
    }
  }, [onHistoryUpdate]);

  // 处理清空所有记录
  const handleClearAll = useCallback(async () => {
    try {
      clearAllHistory();
      message.success('已清空所有历史记录');
      onHistoryUpdate();
    } catch (error) {
      message.error('清空失败');
    }
  }, [onHistoryUpdate]);

  // 处理双击编辑
  const handleDoubleClick = useCallback((item: HistoryItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  }, []);

  // 处理名称编辑完成
  const handleEditComplete = useCallback(async () => {
    if (editingId && editingName.trim()) {
      try {
        updateHistoryName(editingId, editingName.trim());
        message.success('名称已更新');
        onHistoryUpdate();
      } catch (error) {
        message.error('更新失败');
      }
    }
    setEditingId(null);
    setEditingName('');
  }, [editingId, editingName, onHistoryUpdate]);



  return (
    <div className="history-panel">
      <Card
        title="历史记录"
        size="small"
        className="history-card"
        extra={
          history.length > 0 && (
            <Popconfirm
              title="确定要清空所有历史记录吗？"
              onConfirm={handleClearAll}
              okText="确定"
              cancelText="取消"
              placement="bottomRight"
            >
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                danger
              >
                清空
              </Button>
            </Popconfirm>
          )
        }
      >
        {history.length === 0 ? (
          <Empty
            description="暂无历史记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ margin: '20px 0' }}
          />
        ) : (
          <List
            size="small"
            dataSource={history}
            renderItem={(item) => (
              <List.Item
                className="history-item"
                onClick={() => handleSelect(item)}
                onDoubleClick={() => handleDoubleClick(item)}
                actions={[
                  <Popconfirm
                    key="delete"
                    title="确定要删除这条历史记录吗？"
                    onConfirm={(e) => handleDelete(item.id, e as any)}
                    okText="确定"
                    cancelText="取消"
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                ]}
              >
                <div className="history-item-content">
                  {editingId === item.id ? (
                    <Input
                      size="small"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onPressEnter={handleEditComplete}
                      onBlur={handleEditComplete}
                      autoFocus
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <>
                      <div className="history-item-name">
                        <EditOutlined className="edit-icon" />
                        {item.name}
                      </div>
                      <div className="history-item-time">{item.createdAt}</div>
                    </>
                  )}
                </div>
              </List.Item>
            )}
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          />
        )}
      </Card>
    </div>
  );
};

export default HistoryPanel;