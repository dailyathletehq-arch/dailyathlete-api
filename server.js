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
      training: `You are an elite sports performance coach. Create specific training programs using COMPACT FORMAT to fit more content:
- Exercises: "Exercise Name: SetsxReps @ RPE/weight, Xsec rest. Cue: brief cue." (one line per exercise)
- Every workout day must list every exercise in this compact format
- Rest days: list recovery activities with duration
- Be thorough but concise — use abbreviations where clear
Health conditions and allergies are hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,

      nutrition: `You are an elite registered dietitian. Create specific nutrition plans using COMPACT FORMAT:
- Meals: "Meal name (time): food + portion + cal, food + portion + cal. Total: Xcal"
- One line per meal, use abbreviations
- Only clean supplements: no heavy metals, no sucralose, no artificial sweeteners
- Food allergies and medications are hard rules
Respond with ONLY valid complete JSON, no markdown, no backticks.`,

      coach: `You are an elite AI sports performance coach. Respond in plain text — warm, direct, specific, immediately actionable. 2-4 sentences max.`
    };

    const maxTokens = { training: 4000, nutrition: 4000, coach: 500 };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens[mode] || 4000,
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

    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json({ result });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('DailyAthlete API running on port ' + PORT));
