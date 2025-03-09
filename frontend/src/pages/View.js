import React, { useState } from "react";

const View = () => {
  const [imageSrc, setImageSrc] = useState("");

  const jsonData = [
    { Date: "2024-01-01", Correct: 1 },
    { Date: "2024-01-02", Correct: 7 },
    { Date: "2024-01-03", Correct: 10 },
  ];

  const handleGenerateGraph = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate-graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ json_data: jsonData, selected_params: ["Correct"] }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);  // ✅ Dynamically update image without storing it
        console.log("Graph generated successfully");
      } else {
        console.error("Failed to generate graph");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleGenerateGraph}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4"
      >
        Generate Graph
      </button>

      {imageSrc && (
        <img 
          src={imageSrc}  // ✅ Dynamically display fetched image
          alt="Generated Graph"
          className="w-1/2 h-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default View;
