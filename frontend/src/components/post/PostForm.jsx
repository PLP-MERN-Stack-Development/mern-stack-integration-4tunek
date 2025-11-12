import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../api/useApi';

function PostForm({ isEdit = false }) {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    if (isEdit && id) {
      const fetchPost = async () => {
        const data = await request(`/posts/${id}`);
        if (data?.data) setForm({ title: data.data.title, content: data.data.content });
      };
      fetchPost();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isEdit ? `/posts/${id}` : '/posts';
    const method = isEdit ? 'PUT' : 'POST';
    const data = await request(endpoint, method, form);
    if (data?.success) navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input
        name="title"
        placeholder="Post Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="content"
        placeholder="Post Content"
        value={form.content}
        onChange={handleChange}
        className="w-full border p-2 rounded h-40"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isEdit ? 'Update Post' : 'Create Post'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

export default PostForm;
