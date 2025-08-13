import { useState } from "react";
import { Sparkles, Hash,LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prompt = `Schreibe einen Blogtitel zum Stichwort ${input} in der Kategorie ${selectedCategory}.`;
      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">KI Titel Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Schlüsselwort</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          required
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
          placeholder="The furture of artificial intelligence is...."
        />
        <p className="mt-4 text-sm font-medium">Kategorie</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {blogCategories.map((item, index) => (
            <span
              onClick={() => setSelectedCategory(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedCategory === item
                  ? "bg-blue-50 text-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:scale-101 ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="w-5 animate-spin" />{" "}
              <Hash className="w-5" /> Titel generieren...
            </>
          ) : (
            <>
              <Hash className="w-5" />
              Titel generieren
            </>
          )}
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generierte Title</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9 cursor-pointer" />
              <p>
                Gib ein Thema ein und klicke auf „Titel generieren“, um zu
                starten.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
