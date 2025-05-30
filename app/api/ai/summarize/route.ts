import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'Texte requis' }, { status: 400 });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001', // à adapter si tu déploies
        'X-Title': 'OpenDOCS',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Tu es un assistant qui résume les textes en français.' },
          { role: 'user', content: `Merci de résumer ce texte : ${text}` },
        ],
      }),
    });

    const data = await response.json();
    console.log('📩 OpenRouter réponse :', data);

    if (data?.choices?.[0]?.message?.content) {
      return NextResponse.json({ summary: data.choices[0].message.content });
    }

    return NextResponse.json({ error: 'Pas de résumé généré.' }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur IA' }, { status: 500 });
  }
}
