import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";

export default function PostDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        if (res.data?.success) {
          setPost(res.data.data);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.featuredImage && (
        <img
          src={`http://localhost:5000/uploads/${post.featuredImage}`}
          alt={post.title}
          className="mb-4 w-full rounded"
        />
      )}
      <p className="mb-2 text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500">
        Category: {post.category?.name || "Uncategorized"}
      </p>
      {post.tags?.length > 0 && (
        <p className="text-sm text-gray-500">
          Tags: {post.tags.join(", ")}
        </p>
      )}
    </div>
  );
}
