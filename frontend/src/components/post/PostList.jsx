import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../api/useApi';

function PostList() {
  const { request, loading, error } = useApi();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await request('/posts');
      if (data?.data) setPosts(data.data);
    };
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post._id} className="p-4 border rounded-lg shadow-sm">
          <Link to={`/posts/${post._id}`} className="text-xl font-bold text-blue-600">
            {post.title}
          </Link>
          <p className="text-gray-600">{post.content.substring(0, 120)}...</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
