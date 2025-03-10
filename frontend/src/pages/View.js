import React, { useState } from "react";
import "./View.css"; // Import the scoped CSS file

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
        setImageSrc(imageUrl);
        console.log("Graph generated successfully");
      } else {
        console.error("Failed to generate graph");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="view-container">
      <button onClick={handleGenerateGraph}>Generate Graph</button>
      {imageSrc && <img src={imageSrc} alt="Generated Graph" />}
    </div>
  );
};

export default View;
