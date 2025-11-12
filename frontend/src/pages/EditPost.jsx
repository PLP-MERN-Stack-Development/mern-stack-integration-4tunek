import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        setForm({ title: data.data.title, content: data.data.content });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    fetchPost();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/posts/${id}`, form);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Edit post title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Textarea
          name="content"
          placeholder="Update content..."
          value={form.content}
          onChange={handleChange}
          rows={8}
          required
        />
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
