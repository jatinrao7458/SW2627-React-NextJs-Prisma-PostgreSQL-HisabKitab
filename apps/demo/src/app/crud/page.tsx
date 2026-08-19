'use client';

import { useState, useEffect } from 'react';

type Item = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function CrudDemo() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crud');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    try {
      if (editingId) {
        // Update
        const res = await fetch('/api/crud', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingId, ...form }),
        });
        const data = await res.json();
        if (data.success) {
          setItems(items.map((item) => (item._id === editingId ? data.data : item)));
          setEditingId(null);
        }
      } else {
        // Create
        const res = await fetch('/api/crud', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setItems([...items, data.data]);
        }
      }
      setForm({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to submit item', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/crud?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  const handleEdit = (item: Item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item._id);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">CRUD Operations (Mocked MongoDB)</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-black"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border p-2 rounded text-black"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', description: '' });
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-black">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No items found. Create one above.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-2">ID: {item._id} | Created: {new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
