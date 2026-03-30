import { useState, useEffect, useCallback, FormEvent } from 'react';
import './App.css';
import { TodoItem as TodoItemType } from './types';
import { UpdateTodoRequest } from './types';
import TodoItem from './TodoItem';

const App = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todoitems');
        if (!response.ok) {
          throw new Error(`Failed to fetch todos: ${response.statusText}`);
        }
        const data: TodoItemType[] = await response.json();
        setTodos(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    try {
      const response = await fetch('/api/todoitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add todo: ${response.statusText}`);
      }
      const created: TodoItemType = await response.json();
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [newTitle]);

  const updateTodo = useCallback(
    async (id: string, changes: UpdateTodoRequest) => {
      try {
        const response = await fetch(`/api/todoitems/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changes),
        });
        if (!response.ok) {
          throw new Error(`Failed to update todo: ${response.statusText}`);
        }
        const updated: TodoItemType = await response.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updated : todo))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
    []
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/todoitems/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete todo: ${response.statusText}`);
        }
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    },
    []
  );

  return (
    <div className="app">
      <h1 className="appTitle">To-Do List</h1>
      {error && <div className="errorBanner">{error}</div>}
      <form className="addForm" onSubmit={addTodo}>
        <input
          type="text"
          className="addInput"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-add" disabled={!newTitle.trim()}>
          Add
        </button>
      </form>
      {loading ? (
        <p className="statusMessage">Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="statusMessage">No tasks yet. Add one above!</p>
      ) : (
        <ul className="todoList">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              isCompleted={todo.isCompleted}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
