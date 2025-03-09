import React, { useState } from "react";
import grph from "../pages/graph.png"
const View = () => {
  const [imageSrc, setImageSrc] = useState("");

  const jsonData = [
    { Date: "2024-01-01", Correct: 18},
    { Date: "2024-01-02", Correct: 7 },
    { Date: "2024-01-03", Correct: 3},
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
        const data = await response.json();
        setImageSrc(data.image_url);  // ✅ Update state with the image URL
        console.log(data)
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
          src={grph}  // ✅ Display the dynamically fetched image
          alt="Generated Graph"
          className="w-1/2 h-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default View;
