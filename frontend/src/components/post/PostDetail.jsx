import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../api/useApi';

function PostDetail() {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const data = await request(`/posts/${id}`);
      if (data?.data) setPost(data.data);
    };
    fetchPost();
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <article className="p-6 border rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-4">By {post.author?.name || 'Anonymous'}</p>
    </article>
  );
}

export default PostDetail;
