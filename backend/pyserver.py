import sys
sys.stdout.reconfigure(encoding='utf-8')

import matplotlib
matplotlib.use("Agg")  # Fix Matplotlib GUI issue

import io
import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generate_graph(json_data, selected_params):
    """Generate a graph and return it as an in-memory image."""
    try:
        data = pd.DataFrame(json_data)
        data["Date"] = pd.to_datetime(data["Date"])
        data = data.sort_values(by="Date")

        data["Combined Value"] = data[selected_params].sum(axis=1)

        # Matplotlib plotting
        plt.figure(figsize=(10, 5))
        plt.plot(data["Date"], data["Combined Value"], marker="s", linestyle="-", color="green", label="Combined Value")
        plt.xlabel("Date")
        plt.ylabel("Combined Value")
        plt.title(f"Trend of {', '.join(selected_params)} Over Time")
        plt.xticks(rotation=45)
        plt.legend()
        plt.grid(True)

        # Save the image to a BytesIO object instead of saving it as a file
        img_io = io.BytesIO()
        plt.savefig(img_io, format="png")
        plt.close()
        img_io.seek(0)  # Reset pointer to the start of the stream

        return img_io  # Return the in-memory image
    except Exception as e:
        return str(e)

@app.route("/generate-graph", methods=["POST"])
def generate_graph_api():
    """API endpoint to generate a graph and return it as an image response."""
    try:
        data = request.json  
        selected_params = data.get("selected_params", ["Correct"])
        json_data = data.get("json_data", [])

        if not json_data:
            return jsonify({"error": "No data provided"}), 400

        img_io = generate_graph(json_data, selected_params)
        
        return send_file(img_io, mimetype="image/png")  # Directly send the image
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("🚀 Flask server is starting...")
    app.run(debug=True)
