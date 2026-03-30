import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { UpdateTodoRequest } from './types';

interface TodoItemProps {
  id: string;
  title: string;
  isCompleted: boolean;
  onUpdate: (id: string, changes: UpdateTodoRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem = ({
  id,
  title,
  isCompleted,
  onUpdate,
  onDelete,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = useCallback(() => {
    onUpdate(id, { isCompleted: !isCompleted });
  }, [id, isCompleted, onUpdate]);

  const handleEdit = useCallback(() => {
    setEditTitle(title);
    setIsEditing(true);
  }, [title]);

  const handleSave = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== title) {
      onUpdate(id, { title: trimmed });
    }
    setIsEditing(false);
  }, [editTitle, id, onUpdate, title]);

  const handleCancel = useCallback(() => {
    setEditTitle(title);
    setIsEditing(false);
  }, [title]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  return (
    <li className="todoItem">
      <input
        type="checkbox"
        className="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
      />
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            type="text"
            className="editInput"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btnSave" onClick={handleSave}>
            Save
          </button>
          <button className="btn btnCancel" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className={`title ${isCompleted ? 'completed' : ""}`}>
            {title}
          </span>
          <button className="btn btnEdit" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btnDelete" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
