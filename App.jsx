
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [prompt, setPrompt] = useState("");
  const [concept, setConcept] = useState("");
  const [planImg, setPlanImg] = useState(null);
  const [renderImg, setRenderImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const generateConcept = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer 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`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are ArchiMind, an AI trained on 5000 architects. Generate smart design concepts for architecture students."
            },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      setConcept(data.choices[0].message.content);
      setPlanImg("https://via.placeholder.com/600x400?text=Generated+2D+Plan");
      setRenderImg("https://via.placeholder.com/600x400?text=Generated+3D+Render");
    } catch (error) {
      setConcept("❌ Failed to generate design concept. Check your API key or internet.");
    }

    setLoading(false);
  };

  const exportProject = () => {
    const data = {
      prompt,
      concept,
      planImage: planImg,
      renderImage: renderImg,
      files: files.map(f => f.name)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "archimind_project.json";
    link.click();
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>🏛️ ArchiMind – AI for Architecture</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your site, project needs, architect style..."
        rows={5}
        style={{ width: "100%", padding: "1rem" }}
      />

      <input
        type="file"
        accept=".pdf,.jpg,.png,.jpeg,.dwg,.dxf"
        multiple
        onChange={handleFiles}
        style={{ margin: "1rem 0" }}
      />

      <button onClick={generateConcept} disabled={loading} style={{ padding: "1rem", fontSize: "1rem" }}>
        {loading ? "Generating..." : "Generate Concept"}
      </button>

      {concept && (
        <div style={{ marginTop: "2rem", background: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
          <h2>📝 Design Concept</h2>
          <pre>{concept}</pre>

          {planImg && (
            <>
              <h3>📐 2D Plan</h3>
              <img src={planImg} alt="2D Plan" style={{ width: "100%", borderRadius: "8px" }} />
            </>
          )}

          {renderImg && (
            <>
              <h3>🏗️ 3D Render</h3>
              <img src={renderImg} alt="3D Render" style={{ width: "100%", borderRadius: "8px" }} />
            </>
          )}

          <h3>📎 Uploaded Files</h3>
          <ul>
            {files.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>

          <button onClick={exportProject} style={{ marginTop: "1rem" }}>
            💾 Export Project
          </button>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
