import matplotlib
matplotlib.use("Agg")  # Fix Matplotlib GUI issue

import os
import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

IMAGE_PATH = r"C:\Users\yamin\NeuroProject\frontend\src\pages/graph.png"

def generate_graph(json_data, output_path, selected_params):
    """Generate and save a graph from JSON data."""
    try:
        data = pd.DataFrame(json_data)
        data["Date"] = pd.to_datetime(data["Date"])
        data = data.sort_values(by="Date")

        data["Combined Value"] = data[selected_params].sum(axis=1)

        # Matplotlib plotting (now using non-GUI backend)
        plt.figure(figsize=(10, 5))
        plt.plot(data["Date"], data["Combined Value"], marker="s", linestyle="-", color="green", label="Combined Value")
        plt.xlabel("Date")
        plt.ylabel("Combined Value")
        plt.title(f"Trend of {', '.join(selected_params)} Over Time")
        plt.xticks(rotation=45)
        plt.legend()
        plt.grid(True)

        plt.savefig(output_path)
        plt.close()

        return output_path
    except Exception as e:
        return str(e)

@app.route("/generate-graph", methods=["POST"])
def generate_graph_api():
    """API endpoint to receive JSON and generate a graph."""
    try:
        data = request.json  
        selected_params = data.get("selected_params", ["Correct"])
        json_data = data.get("json_data", [])

        if not json_data:
            return jsonify({"error": "No data provided"}), 400

        output_file = generate_graph(json_data, IMAGE_PATH, selected_params)
        
        return jsonify({"image_url": output_file})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Flask server is starting...")
    app.run(debug=True)
