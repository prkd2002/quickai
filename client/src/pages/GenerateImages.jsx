import { useState } from "react";
import { Hash, Sparkles, Image,LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibili Style",
    "Anime Style",
    "Cartoon style",
    "Fantasy style",
    "Realistic style",
    "3D style",
    "Portrait style",
  ];
  const [selectedStyle, setSelectedStyle] = useState(imageStyle[0]);
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const prompt = `Erzeuge ein Bild von ${input} im Stil von ${selectedStyle}.`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish: `${publish}` },
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
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">KI Bilder Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Beschreib deine Bilder</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          required
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
          placeholder="Beschreibe, was du auf dem Bild sehen möchtest …
"
        />
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle.map((item, index) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition">
              {" "}
            </div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Dieses Bild offentlich machen</p>
        </div>
        <br />
        <button
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#41f6ab] to-[#00AD25] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:scale-101 ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          {!isLoading ? (
            <>
              <Image className="w-5" />
              Bilder generieren
            </>
          ) : (
            <>
              <LoaderCircle className="animate-spin w-5" />
              <Image className="w-5" />
              Bilder generieren....
            </>
          )}
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ]">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generierte Bilder</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9 cursor-pointer" />
              <p>
                Gib ein Thema ein und klicke auf „Bilder generieren“, um zu
                starten.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img src={content} alt="image" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
