// app/api/ai/generate-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { prompt } = await req.json();

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });
    

    const data = await res.json();
    console.log('✅ OpenAI response:', data);

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      console.error('🔴 Mauvaise réponse OpenAI :', data);
      return NextResponse.json({ error: 'Réponse IA vide ou incorrecte' }, { status: 500 });
    }

    return NextResponse.json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error('❌ Erreur API OpenAI :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
