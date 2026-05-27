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
      training: `You are an elite sports performance coach and certified strength & conditioning specialist with 20+ years experience training professional athletes. Create brutally specific training programs:
- Every workout day: list every single exercise with exact sets x reps x rest time, weight guidance (RPE 1-10 scale or % bodyweight), and 2-3 specific coaching cues per exercise
- Rest days: exact recovery activities with duration, named stretches with hold times
- Progressive overload: explain exactly how weights/reps increase week over week
- Sport-specific: every drill, movement pattern, and exercise must serve the athlete's specific sport and position
Health conditions, injuries, and allergies are absolute hard rules — never violate them.
Respond with ONLY valid complete JSON, no markdown, no backticks, no text before or after.`,

      nutrition: `You are an elite registered dietitian and sports nutritionist with 20+ years experience. Create brutally specific nutrition plans:
- Exact daily calorie target with full macro breakdown in grams (protein/carbs/fat)
- 7 different daily meal plans (one per day) with every meal, exact portion sizes in oz/grams/cups, calorie count per meal, and prep instructions
- Meal timing relative to workouts (pre/intra/post workout nutrition)
- Specific foods available at their listed grocery stores with budget breakdown per day
- Supplement stack: exact brand names, doses in mg/g, timing, monthly cost, where to buy — only safe given their medications and allergies
- Recovery: exact sleep targets, full mobility routine with named stretches and hold times, post-workout routine step by step
Food allergies and medications are absolute hard rules — never violate them. Only recommend supplements with no heavy metals, no sucralose, no artificial sweeteners, and no harmful additives.
Respond with ONLY valid complete JSON, no markdown, no backticks, no text before or after.`,

      coach: `You are an elite AI sports performance coach. The athlete has a personalized program and is checking in. Respond in plain text — warm, direct, specific, and immediately actionable. 2-4 sentences unless they asked something detailed. Never recommend anything that conflicts with their health issues, allergies, or medications.`
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
