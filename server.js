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
      <td style="padding:14px 18px;border-bottom:1px solid #1A2540;vertical-align:top;width:110px;background:#0F1628;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0057FF;margin-bottom:4px;">${d.day}</div>
        <div style="font-size:11px;color:#6B7A99;">${d.focus}</div>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.75;background:#111827;">${d.details}</td>
    </tr>`).join('');

  const mealRows = meals.map(d => `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid #1A2540;vertical-align:top;width:110px;background:#0F1628;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4CAF82;margin-bottom:4px;">${d.day}</div>
        <div style="font-size:11px;color:#6B7A99;">${d.calories||''} cal</div>
      </td>
      <td style="padding:14px 18px;border-bottom:1px solid #1A2540;font-size:13px;color:#9BA8BF;line-height:1.75;background:#111827;">${d.meals}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Your DailyAthlete Program</title>
</head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0F1E;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1A2540;">

  <!-- HEADER -->
  <tr><td style="background:#0F1628;padding:28px 32px;text-align:center;border-bottom:1px solid #1A2540;">
    <table cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="background:#0057FF;border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;">
          <span style="color:#FFFFFF;font-size:20px;font-weight:800;line-height:40px;">D</span>
        </td>
        <td style="padding-left:12px;vertical-align:middle;">
          <span style="font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">Daily</span><span style="font-size:22px;font-weight:800;color:#0057FF;letter-spacing:-0.5px;">Athlete</span>
        </td>
      </tr>
    </table>
    <div style="margin-top:8px;font-size:11px;color:#6B7A99;letter-spacing:3px;text-transform:uppercase;">AI-Powered Performance Coach</div>
  </td></tr>

  <!-- PROGRAM TITLE BANNER -->
  <tr><td style="background:linear-gradient(135deg,#003DB8,#0057FF);padding:32px;text-align:center;border-bottom:1px solid #1A2540;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);color:#FFFFFF;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:5px 16px;border-radius:50px;margin-bottom:14px;">✦ Your Personalized Program</div>
    <div style="font-size:26px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;margin-bottom:12px;line-height:1.2;">${plan.programTitle}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.75);line-height:1.75;max-width:480px;margin:0 auto;">${plan.summary}</div>
  </td></tr>

  <!-- WEEKLY OVERVIEW -->
  <tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid #1A2540;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:14px;">📋 &nbsp;Weekly Structure & Progression</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.85;">${plan.weeklyOverview}</div>
  </td></tr>

  <!-- TRAINING SCHEDULE -->
  <tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid #1A2540;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:16px;">📅 &nbsp;7-Day Training Schedule</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">
      ${dayRows}
    </table>
  </td></tr>

  ${nutrition ? `
  <!-- NUTRITION -->
  <tr><td style="background:#0F1628;padding:28px 32px;border-bottom:1px solid #1A2540;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:14px;">🍽️ &nbsp;Nutrition Plan & Targets</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.85;margin-bottom:24px;">${nutrition.diet}</div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;margin-bottom:16px;">🥗 &nbsp;Daily Meals</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1A2540;border-radius:12px;overflow:hidden;">
      ${mealRows}
    </table>
  </td></tr>
  <tr><td style="background:#111827;padding:28px 32px;border-bottom:1px solid #1A2540;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:14px;">💊 &nbsp;Supplement Stack</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.85;margin-bottom:24px;">${nutrition.supplements}</div>
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:14px;">😴 &nbsp;Recovery Protocol</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.85;">${nutrition.recovery}</div>
  </td></tr>` : ''}

  <!-- UPGRADE CTA -->
  <tr><td style="background:linear-gradient(135deg,#0A1A3E,#0F1628);padding:36px 32px;text-align:center;border-bottom:1px solid #1A2540;">
    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:12px;">🤖 &nbsp;Daily Coach</div>
    <div style="font-size:20px;font-weight:800;color:#FFFFFF;margin-bottom:10px;letter-spacing:-0.5px;">Want your coach to adapt this plan daily?</div>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.7;margin-bottom:24px;max-width:420px;margin-left:auto;margin-right:auto;">Get a real-time AI coach that adjusts your workouts, meals, and recovery every single day — based on how you're actually feeling and performing.</div>
    <a href="https://dailyathlete.app/dashboard.html?email=${encodeURIComponent(email)}" style="display:inline-block;background:#0057FF;color:#FFFFFF;font-size:14px;font-weight:700;padding:15px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">Try Daily Coach Free →</a>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0A0F1E;padding:24px 32px;text-align:center;">
    <div style="font-size:12px;color:#6B7A99;margin-bottom:8px;">
      <a href="https://dailyathlete.app/privacy-policy.html" style="color:#6B7A99;text-decoration:none;">Privacy Policy</a>
      &nbsp;·&nbsp;
      <a href="https://dailyathlete.app/terms-and-conditions.html" style="color:#6B7A99;text-decoration:none;">Terms</a>
      &nbsp;·&nbsp;
      <a href="https://dailyathlete.app/contact.html" style="color:#6B7A99;text-decoration:none;">Contact</a>
    </div>
    <div style="font-size:12px;color:#3A4A6A;">© 2026 DailyAthlete. All rights reserved.</div>
    <div style="font-size:11px;color:#2A3A5A;margin-top:8px;line-height:1.6;">DailyAthlete provides general fitness and nutrition information for educational purposes only. Always consult your physician before starting any exercise or nutrition program.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

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
