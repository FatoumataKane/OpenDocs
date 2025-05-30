import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt requis' }, { status: 400 });
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://opendocs.local', // remplace par ton domaine si besoin
        'X-Title': 'OpenDOCS',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant intelligent pour rédiger du contenu textuel.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await res.json();

    console.log('🔍 OpenRouter response:', JSON.stringify(data, null, 2)); // 🔎 DEBUG LOG

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ error: 'Erreur de réponse AI' }, { status: 500 });
    }

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('❌ Erreur AI:', error);
    return NextResponse.json({ error: 'Erreur serveur AI' }, { status: 500 });
  }
}
