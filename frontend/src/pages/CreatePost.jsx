import { useState, useEffect, useContext } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]); // New: store backend validation errors

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.success) setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFeaturedImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]); // clear previous errors

    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("content", form.content.trim());
      payload.append("category", form.category);

      if (form.tags.trim()) {
        const cleanTags = form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        payload.append("tags", JSON.stringify(cleanTags));
      }

      if (featuredImage) payload.append("featuredImage", featuredImage);

      const res = await axios.post("/api/posts", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        alert("Post published successfully!");
        setForm({ title: "", content: "", category: "", tags: "" });
        setFeaturedImage(null);
        navigate("/"); // redirect to home
      } else {
        console.error("Unexpected response:", res.data);
        setErrors([res.data?.message || "Something went wrong"]);
      }
    } catch (err) {
      console.error("Failed to create post:", err.response?.data || err.message);

      // Extract backend validation errors safely
      const backendErrors =
        err.response?.data?.errors ||
        (err.response?.data?.message ? [err.response.data.message] : ["Failed to create post"]);

      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      {errors.length > 0 && (
        <div className="mb-4 p-4 border border-red-400 text-red-700 rounded">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Enter post title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Textarea
          name="content"
          placeholder="Write your post..."
          value={form.content}
          onChange={handleChange}
          rows={8}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Input
          type="text"
          name="tags"
          placeholder="Enter tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
        />

        <Input type="file" accept="image/*" onChange={handleFileChange} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Publishing..." : "Publish Post"}
        </Button>
      </form>
    </div>
  );
}
