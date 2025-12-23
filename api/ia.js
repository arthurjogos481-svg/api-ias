import fetch from "node-fetch";

export default async function handler(req, res) {
  const msg = req.query.msg;

  if (!msg) {
    return res.status(400).send("Envie ?msg=texto");
  }

  // Verifica se a API key está definida
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).send("Erro: OPENAI_API_KEY não definida no Vercel");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }]
      })
    });

    const data = await response.json();

    // Retorna apenas o texto da IA para o BDFD
    res.send(data.choices[0].message.content);

  } catch (err) {
    res.status(500).send("Erro na IA");
  }
}
