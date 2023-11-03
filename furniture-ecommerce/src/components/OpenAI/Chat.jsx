import React, { useState } from "react";
import OpenAI from "openai";
import "../../styles/chat.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Index() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);

      const response = await openai.completions.create({
        model: "davinci",
        prompt:
          `User: Rekomendasikan warna sofa yang cocok untuk ruang tamu minimalis dengan gaya dekorasi modern.` +
          prompt,
        max_tokens: 150,
      });

      setResult(response.choices[0].text);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <label>
          Pertanyaan:
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit">Kirim</button>
      </form>
      {isLoading && <p className="loading">Loading...</p>}
      {result && (
        <div>
          <h2>Jawaban:</h2>
          <p className="response">{result}</p>
        </div>
      )}
    </div>
  );
}
