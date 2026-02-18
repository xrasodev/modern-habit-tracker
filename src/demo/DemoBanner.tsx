import { useState } from "react";

const DemoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-indigo-800/95 text-white px-4 py-2 flex items-center justify-between shadow-md z-50">
      {/* Banner text */}
      <span className="text-sm truncate">
        ⚠️ Demo version · Changes not saved
      </span>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Close demo banner"
        className="w-8 h-8 flex items-center justify-center rounded-full text-white hover:bg-white hover:text-indigo-800 transition-colors duration-150"
      >
        ✕
      </button>
    </div>
  );
};

export default DemoBanner;
