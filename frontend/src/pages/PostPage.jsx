import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "../context/AuthContext";

export default function Post() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/posts/${id}/comments`, { content: comment });
      setPost(data.data); 
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  if (!post)
    return <p className="text-center mt-10 text-muted-foreground">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleString()} by{" "}
        <span className="font-semibold">{post.author?.name || "Anonymous"}</span>
      </div>

      {post.featuredImage && (
        <img
          src={`/uploads/${post.featuredImage}`}
          alt={post.title}
          className="w-full rounded-lg my-4"
        />
      )}

      <p className="leading-relaxed text-lg">{post.content}</p>

      <div className="flex gap-4 pt-4">
        <Button asChild>
          <Link to={`/edit/${post._id}`}>Edit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back to Posts</Link>
        </Button>
      </div>

      <div className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Comments ({post.comments.length})</h2>
        {post.comments.map((c) => (
          <div key={c._id || c.createdAt} className="mb-4 border-b pb-2">
            <p className="text-sm text-gray-600">
              {c.user?.name || "Anonymous"} • {new Date(c.createdAt).toLocaleString()}
            </p>
            <p>{c.content}</p>
          </div>
        ))}

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mt-4 space-y-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        ) : (
          <p className="text-gray-500 mt-2">Login to post a comment.</p>
        )}
      </div>
    </div>
  );
}
