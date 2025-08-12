import { useState } from "react";
import { Sparkles,  Eraser } from "lucide-react";

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left col */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold"> Hintergrundentfernung</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload image</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          required
          className="w-full text-gray-600 p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          JPG-, PNG- und weitere Bildformate werden unterstützt
        </p>

        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:scale-101">
          <Eraser className="w-5" />
          Hintergrung entfernen
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ]">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Verarbeitetes Bild</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Eraser className="w-9 h-9 cursor-pointer" />
            <p>
              Lade ein Bild hoch und klicke auf „Hintergrund entfernen“, um zu
              starten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
