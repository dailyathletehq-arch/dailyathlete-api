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

  const dayRows = days.map((d, i) => `
    <tr>
      <td style="padding:0;vertical-align:top;width:130px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:16px 18px;background:${i%2===0?'#0A1628':'#0D1A30'};border-right:2px solid #0057FF;">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;margin-bottom:5px;">${d.day}</div>
            <div style="font-size:11px;color:#9BA8BF;line-height:1.4;">${d.focus}</div>
          </td></tr>
        </table>
      </td>
      <td style="padding:16px 18px;background:${i%2===0?'#0F1628':'#111827'};font-size:13px;color:#9BA8BF;line-height:1.8;border-bottom:1px solid #1E2D45;">${d.details}</td>
    </tr>`).join('');

  const mealRows = meals.map((d, i) => `
    <tr>
      <td style="padding:0;vertical-align:top;width:130px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:16px 18px;background:${i%2===0?'#0A1E16':'#0D2019'};border-right:2px solid #4CAF82;">
            <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;margin-bottom:5px;">${d.day}</div>
            <div style="font-size:11px;color:#9BA8BF;">${d.calories||''} cal</div>
          </td></tr>
        </table>
      </td>
      <td style="padding:16px 18px;background:${i%2===0?'#0F1628':'#111827'};font-size:13px;color:#9BA8BF;line-height:1.8;border-bottom:1px solid #1E2D45;">${d.meals}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="color-scheme" content="dark"/>
<title>Your DailyAthlete Program</title>
</head>
<body style="margin:0;padding:0;background:#060B18;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">

<!-- OUTER WRAPPER -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060B18;padding:48px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;">

  <!-- TOP ACCENT LINE -->
  <tr><td style="background:linear-gradient(90deg,#003DB8,#0057FF,#3380FF,#0057FF,#003DB8);height:3px;border-radius:3px 3px 0 0;"></td></tr>

  <!-- HEADER -->
  <tr><td style="background:#0A0F1E;padding:36px 40px 28px;text-align:center;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:20px;">
      <tr>
        <td style="background:#0057FF;border-radius:12px;width:48px;height:48px;text-align:center;vertical-align:middle;">
          <span style="color:#FFFFFF;font-size:24px;font-weight:900;font-family:Arial,sans-serif;line-height:48px;">D</span>
        </td>
        <td style="padding-left:14px;vertical-align:middle;">
          <span style="font-size:26px;font-weight:900;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;letter-spacing:-1px;">Daily</span><span style="font-size:26px;font-weight:900;color:#0057FF;font-family:Arial,Helvetica,sans-serif;letter-spacing:-1px;">Athlete</span>
        </td>
      </tr>
    </table>
    <div style="font-size:10px;color:#3A5080;letter-spacing:5px;text-transform:uppercase;font-family:Arial,sans-serif;">AI · POWERED · PERFORMANCE · COACH</div>
  </td></tr>

  <!-- HERO BANNER -->
  <tr><td style="padding:0;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#0057FF;padding:6px 40px;text-align:center;">
          <span style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">✦ &nbsp; YOUR PERSONALIZED PROGRAM &nbsp; ✦</span>
        </td>
      </tr>
      <tr>
        <td style="background:#003DB8;padding:36px 40px;text-align:center;">
          <div style="font-size:30px;font-weight:900;color:#FFFFFF;letter-spacing:-1px;line-height:1.15;margin-bottom:16px;font-family:Arial,Helvetica,sans-serif;">${plan.programTitle}</div>
          <div style="width:48px;height:2px;background:#0057FF;margin:0 auto 20px;"></div>
          <div style="font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;max-width:460px;margin:0 auto;font-family:Arial,sans-serif;">${plan.summary}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- WEEKLY OVERVIEW -->
  <tr><td style="background:#0D1321;padding:32px 40px;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;border-top:1px solid #1E2D45;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-bottom:16px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:#0057FF;width:3px;border-radius:3px;">&nbsp;</td>
              <td style="padding-left:12px;">
                <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;font-family:Arial,sans-serif;">Weekly Structure &amp; Progression</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="font-size:14px;color:#9BA8BF;line-height:1.9;font-family:Arial,sans-serif;">${plan.weeklyOverview}</td></tr>
    </table>
  </td></tr>

  <!-- SCHEDULE HEADER -->
  <tr><td style="background:#0A1628;padding:20px 40px 0;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#0057FF;width:3px;border-radius:3px;">&nbsp;</td>
        <td style="padding-left:12px;">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#0057FF;font-family:Arial,sans-serif;">7-Day Training Schedule</span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- SCHEDULE TABLE -->
  <tr><td style="padding:16px 40px 32px;background:#0A1628;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1E2D45;border-radius:10px;overflow:hidden;">
      ${dayRows}
    </table>
  </td></tr>

  ${nutrition ? `
  <!-- NUTRITION HEADER -->
  <tr><td style="background:#0D1321;padding:28px 40px 0;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;border-top:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#4CAF82;width:3px;border-radius:3px;">&nbsp;</td>
        <td style="padding-left:12px;">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;font-family:Arial,sans-serif;">Nutrition Plan &amp; Daily Targets</span>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#0D1321;padding:16px 40px 28px;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <div style="font-size:14px;color:#9BA8BF;line-height:1.9;font-family:Arial,sans-serif;">${nutrition.diet}</div>
  </td></tr>

  <!-- MEALS HEADER -->
  <tr><td style="background:#0A1628;padding:20px 40px 0;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="background:#4CAF82;width:3px;border-radius:3px;">&nbsp;</td>
        <td style="padding-left:12px;">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#4CAF82;font-family:Arial,sans-serif;">Daily Meal Plans</span>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 40px 32px;background:#0A1628;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1E2D45;border-radius:10px;overflow:hidden;">
      ${mealRows}
    </table>
  </td></tr>

  <!-- SUPPLEMENTS -->
  <tr><td style="background:#0D1321;padding:28px 40px;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;border-top:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td style="background:#E0B84A;width:3px;border-radius:3px;">&nbsp;</td>
        <td style="padding-left:12px;">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#E0B84A;font-family:Arial,sans-serif;">Supplement Stack</span>
        </td>
      </tr>
    </table>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.9;font-family:Arial,sans-serif;">${nutrition.supplements}</div>
  </td></tr>

  <!-- RECOVERY -->
  <tr><td style="background:#0A1628;padding:28px 40px;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;border-top:1px solid #1E2D45;">
    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
      <tr>
        <td style="background:#60A0FF;width:3px;border-radius:3px;">&nbsp;</td>
        <td style="padding-left:12px;">
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#60A0FF;font-family:Arial,sans-serif;">Recovery Protocol</span>
        </td>
      </tr>
    </table>
    <div style="font-size:14px;color:#9BA8BF;line-height:1.9;font-family:Arial,sans-serif;">${nutrition.recovery}</div>
  </td></tr>
  ` : ''}

  <!-- CTA SECTION -->
  <tr><td style="background:#060B18;padding:48px 40px;text-align:center;border-left:1px solid #1E2D45;border-right:1px solid #1E2D45;border-top:1px solid #1E2D45;">
    <div style="font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#0057FF;font-family:Arial,sans-serif;margin-bottom:16px;">🤖 &nbsp; DAILY COACH</div>
    <div style="font-size:24px;font-weight:900;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.5px;margin-bottom:12px;line-height:1.2;">Want your coach to adapt<br/>this plan every day?</div>
    <div style="width:40px;height:2px;background:#0057FF;margin:0 auto 20px;"></div>
    <div style="font-size:14px;color:#6B7A99;line-height:1.8;max-width:400px;margin:0 auto 28px;font-family:Arial,sans-serif;">Get a real-time AI coach that adjusts your workouts, meals, and recovery daily — based on how you're actually feeling and performing.</div>
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:20px;">
      <tr>
        <td style="background:#0057FF;border-radius:12px;padding:16px 40px;">
          <a href="https://dailyathlete.app/dashboard.html?email=${encodeURIComponent(email)}" style="font-size:15px;font-weight:700;color:#FFFFFF;text-decoration:none;letter-spacing:0.3px;font-family:Arial,sans-serif;">Try Daily Coach Free →</a>
        </td>
      </tr>
    </table>
    <div style="font-size:12px;color:#2A3A55;font-family:Arial,sans-serif;">No credit card required · Cancel anytime</div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#040810;padding:28px 40px;text-align:center;border-left:1px solid #1A2540;border-right:1px solid #1A2540;border-top:1px solid #1A2540;">
    <div style="font-size:11px;color:#2A3A55;margin-bottom:10px;font-family:Arial,sans-serif;">
      <a href="https://dailyathlete.app/privacy-policy.html" style="color:#3A5080;text-decoration:none;">Privacy Policy</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://dailyathlete.app/terms-and-conditions.html" style="color:#3A5080;text-decoration:none;">Terms</a>
      &nbsp;&nbsp;·&nbsp;&nbsp;
      <a href="https://dailyathlete.app/contact.html" style="color:#3A5080;text-decoration:none;">Contact</a>
    </div>
    <div style="font-size:11px;color:#1E2D45;font-family:Arial,sans-serif;">© 2026 DailyAthlete. All rights reserved.</div>
    <div style="font-size:10px;color:#141E2E;margin-top:8px;line-height:1.6;font-family:Arial,sans-serif;">DailyAthlete provides general fitness and nutrition information for educational purposes only.<br/>Always consult your physician before starting any exercise or nutrition program.</div>
  </td></tr>

  <!-- BOTTOM ACCENT LINE -->
  <tr><td style="background:linear-gradient(90deg,#003DB8,#0057FF,#3380FF,#0057FF,#003DB8);height:3px;border-radius:0 0 3px 3px;"></td></tr>

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
