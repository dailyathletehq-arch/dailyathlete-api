const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => res.send('ok'));

// ─── Email HTML Builder ───────────────────────────────────────────────────────
function buildEmailHTML(plan, nutrition) {
  const days = plan.days || [];
  const meals = nutrition?.dailyMeals || [];
  const dayRows = days.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;vertical-align:top;width:120px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0057FF;">${d.day}</div>
        <div style="font-size:12px;color:#9BA8BF;margin-top:4px;">${d.focus}</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.7;">${d.details}</td>
    </tr>`).join('');
  const mealRows = meals.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;vertical-align:top;width:120px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4CAF82;">${d.day}</div>
        <div style="font-size:12px;color:#9BA8BF;margin-top:4px;">${d.calories||''} cal</div>
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.7;">${d.meals}</td>
    </tr>`).join('');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F1E;padding:40px 20px;">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#0F1628;border-radius:16px 16px 0 0;padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
<span style="font-size:22px;font-weight:800;color:#FFFFFF;">Daily<span style="color:#0057FF;">Athlete</span></span>
<div style="margin-top:6px;font-size:11px;color:#6B7A99;letter-spacing:2px;text-transform:uppercase;">AI-Powered Performance Coach</div>
</td></tr>
<tr><td style="background:linear-gradient(135deg,rgba(0,61,184,0.5),rgba(0,87,255,0.25));padding:32px;text-align:center;border-bottom:1px solid rgba(0,87,255,0.3);">
<div style="font-size:26px;font-weight:800;color:#FFFFFF;margin-bottom:12px;">${plan.programTitle}</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.7;">${plan.summary}</div>
</td></tr>
<tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">📋 Weekly Structure</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.8;">${plan.weeklyOverview}</div>
</td></tr>
<tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:16px;">📅 7-Day Training Schedule</div>
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">${dayRows}</table>
</td></tr>
${nutrition ? `
<tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">🍽️ Nutrition Plan</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.8;margin-bottom:20px;">${nutrition.diet}</div>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;margin-bottom:16px;">🥗 Daily Meals</div>
<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">${mealRows}</table>
</td></tr>
<tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">💊 Supplements</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.8;margin-bottom:20px;">${nutrition.supplements}</div>
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">😴 Recovery</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.8;">${nutrition.recovery}</div>
</td></tr>` : ''}
<tr><td style="background:#0F1628;padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);">
<div style="font-size:18px;font-weight:800;color:#FFFFFF;margin-bottom:8px;">🤖 Want daily coaching?</div>
<div style="font-size:14px;color:#9BA8BF;line-height:1.6;margin-bottom:20px;">Upgrade to Daily Coach for real-time AI coaching, daily meal plans, and weekly check-ins.</div>
<a href="https://dailyathlete.app/dashboard.html" style="display:inline-block;background:#0057FF;color:#FFFFFF;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;">Get Daily Coach — $4.99/mo</a>
</td></tr>
<tr><td style="background:#0A0F1E;padding:24px 32px;text-align:center;border-radius:0 0 16px 16px;">
<div style="font-size:12px;color:#6B7A99;">© 2026 DailyAthlete · <a href="https://dailyathlete.app/privacy-policy.html" style="color:#6B7A99;">Privacy</a> · <a href="https://dailyathlete.app/contact.html" style="color:#6B7A99;">Contact</a></div>
</td></tr>
</table></td></tr></table></body></html>`;
}

// ─── Send Program Email ───────────────────────────────────────────────────────
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, plan, nutrition } = req.body;
    if (!email || !plan) return res.status(400).json({ error: 'Missing data' });
    const html = buildEmailHTML(plan, nutrition);
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: 'DailyAthlete <coach@dailyathlete.app>', to: email, subject: `Your Program: ${plan.programTitle}`, html })
    });
    const d = await r.json();
    if (d.error) return res.status(500).json({ error: d.error });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Daily Plan Generator ─────────────────────────────────────────────────────
app.post('/api/daily-plan', async (req, res) => {
  try {
    const { profile, dayOfWeek, weeklyPlan } = req.body;
    const prompt = `${JSON.stringify(profile)}

Today is ${dayOfWeek}. The athlete has this weekly program: ${JSON.stringify(weeklyPlan?.plan?.days?.find(d => d.day === dayOfWeek) || {})}

Generate today's complete daily plan. Be specific and actionable.

Return ONLY valid JSON:
{
  "workout": {
    "title": "session title",
    "duration": "estimated duration",
    "warmup": "5 min warmup routine",
    "exercises": [
      {"name": "Exercise", "sets": "4", "reps": "8", "rest": "90s", "weight": "RPE 7", "cue": "coaching tip"}
    ],
    "cooldown": "5 min cooldown routine",
    "coachNote": "motivational note for today"
  },
  "meals": {
    "calories": 2800,
    "protein": 180,
    "carbs": 320,
    "fat": 80,
    "breakfast": {"time": "7:00 AM", "foods": "exact foods with portions", "calories": 520, "prep": "prep instructions"},
    "lunch": {"time": "12:30 PM", "foods": "exact foods with portions", "calories": 640, "prep": "prep instructions"},
    "dinner": {"time": "7:30 PM", "foods": "exact foods with portions", "calories": 680, "prep": "prep instructions"},
    "snacks": [{"time": "10:00 AM", "foods": "snack", "calories": 200}, {"time": "4:00 PM", "foods": "pre-workout snack", "calories": 280}]
  },
  "recovery": "today's specific recovery focus",
  "tip": "one actionable performance tip for today"
}`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 2000, system: 'You are an elite sports performance coach. Generate specific daily training and nutrition plans. Respond with ONLY valid JSON, no markdown.', messages: [{ role: 'user', content: prompt }] })
    });
    const d = await r.json();
    const text = d.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    res.json({ plan: JSON.parse(text) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Coach Message ────────────────────────────────────────────────────────────
app.post('/api/coach', async (req, res) => {
  try {
    const { message, profile, history, dailyPlan } = req.body;
    const context = `You are an elite AI sports performance coach for a Daily Coach subscriber.
Athlete: ${JSON.stringify(profile)}
Today's plan: ${JSON.stringify(dailyPlan)}
Recent conversation: ${(history||[]).slice(-6).map(m=>`${m.role}: ${m.content}`).join('\n')}
Respond warmly, specifically, and immediately actionably. 2-4 sentences. Never conflict with their health issues or allergies.`;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: context, messages: [{ role: 'user', content: message }] })
    });
    const d = await r.json();
    res.json({ reply: d.content.map(b => b.text || '').join('') });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Free Tier Claude ─────────────────────────────────────────────────────────
app.post('/api/claude', async (req, res) => {
  try {
    const { prompt, mode } = req.body;
    const systems = {
      training: `You are an elite sports performance coach. Create specific training programs — exact exercises, sets, reps, rest periods, weight guidance (RPE), coaching cues. Health conditions are hard rules. Respond with ONLY valid complete JSON, no markdown, no backticks.`,
      nutrition: `You are an elite registered dietitian. Give specific nutrition plans. Food allergies and medications are absolute hard rules. Only clean supplements: no heavy metals, no sucralose, no artificial sweeteners. CRITICAL: Respond with ONLY valid complete JSON using EXACTLY the field names specified in the prompt — diet, dailyMeals, supplements, recovery. No other field names. No markdown. No backticks.`,
      coach: `You are an elite AI sports performance coach. Respond in plain text — warm, direct, specific, immediately actionable. 2-4 sentences max.`
    };
    const maxTokens = { training: 4000, nutrition: 4000, coach: 500 };
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens[mode]||4000, system: systems[mode]||systems.training, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await r.json();
    if (!data.content?.length) return res.status(500).json({ error: JSON.stringify(data) });
    const text = data.content.map(b => b.text || '').join('');
    if (mode === 'coach') return res.json({ reply: text });
    res.json({ result: JSON.parse(text.replace(/```json|```/g, '').trim()) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('DailyAthlete API running on port ' + PORT));
