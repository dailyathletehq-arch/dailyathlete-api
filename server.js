const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('ok'));

app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    const systems = {
      training: `You are an elite sports performance coach. Give specific training programs — exact exercises, sets, reps, rest periods, weight guidance (RPE), coaching cues. Health conditions are hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,
      nutrition: `You are an elite registered dietitian. Give specific nutrition plans — exact calories, macros in grams, meal portions, supplement doses. Food allergies and medications are absolute hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,
      coach: `You are an elite AI sports performance coach. Respond in plain text — warm, specific, immediately actionable. 2-3 sentences max.`
    };

    const maxTokens = { training: 3000, nutrition: 3000, coach: 400 };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens[mode] || 3000,
        system: systems[mode] || systems.training,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!data.content || !data.content.length) {
      return res.status(500).json({ error: JSON.stringify(data) });
    }

    const text = data.content.map(b => b.text || '').join('');

    if (mode === 'coach') {
      return res.json({ reply: text });
    }

    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.json({ result });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('DailyAthlete API running on port ' + PORT));
