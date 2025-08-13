import { useState } from "react";
import { Sparkles, LoaderCircle, Scissors } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(false);
  const { getToken } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (object.split(" ").length > 1) {
        return toast("Please enter only one object name");
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);
      const { data } = await axios.post(
        `/api/ai/remove-image-object`,
        formData,
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold"> Objekttentfernung</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Bild hochladen</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          required
          className="w-full text-gray-600 p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
        />

        <p className="mt-6 text-sm font-medium">
          Geben Sie den Namen des zu entfernenden Objekts ein
        </p>
        <textarea
          value={object}
          onChange={(e) => setObject(e.target.value)}
          rows={4}
          required
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
          placeholder="z. B. Uhr oder Löffel – nur ein einzelner Objektname

"
        />

        <button
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:scale-101 ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="w-5 animate-spin" />
              <Scissors className="w-5" />
              Objekt entfernen
            </>
          ) : (
            <>
              <Scissors className="w-5" />
              Objekt entfernen
            </>
          )}
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Verarbeitetes Bild</h1>
        </div>
      {
        !content ? (
           <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9 cursor-pointer" />
            <p>
              Lade ein Bild hoch und klicke auf „Objekt entfernen“, um zu
              starten.
            </p>
          </div>
        </div>
        ):(
          <div className="mt-3">
            <img src={content} alt="image" className="w-full h-full object-cover" />
          </div>
        )
      } 
      </div>
    </div>
  );
};

export default RemoveObject;
