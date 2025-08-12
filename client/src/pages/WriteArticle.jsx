import React, { useState } from "react";
import { Edit, Sparkles } from "lucide-react";

const WriteArticle = () => {
  const articleLength = [
    {
      length: 800,
      text: "Kurz (500–800 Wörter)",
    },
    {
      length: 1200,
      text: "Mittel (500–1200 Wörter)",
    },
    {
      length: 1600,
      text: "Lang (ab 1200 Wörter)",
    },
  ];
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Artikelkonfiguration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Thema des Artikels</p>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          required
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-offset-2 focus:border-blue-500"
          placeholder="The furture of artificial intelligence is...."
        />
        <p className="mt-4 text-sm font-medium">Artikellänge</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:scale-101">
          <Edit className="w-5" />
          Artikel generieren
        </button>
      </form>
      {/* Right col */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generierte Artikel</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Edit className="w-9 h-9 cursor-pointer" />
            <p>
              Gib ein Thema ein und klicke auf „Artikel generieren“, um zu
              starten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
