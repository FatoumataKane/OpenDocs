import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { db } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { fileId } = await req.json();
    if (!fileId) {
  return NextResponse.json({ error: 'fileId manquant' }, { status: 400 });
}

    const file = await db
      .selectFrom('files')
      .select(['name', 'user_id'])
      .where('id', '=', fileId)
      .executeTakeFirst();

    if (!file || file.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Fichier introuvable ou accès refusé' }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), 'public/uploads', file.name);
    const fileBuffer = await fs.readFile(filePath);
    const parsed = await pdfParse(fileBuffer);

    const content = parsed.text;

    if (!content || content.length < 20) {
      return NextResponse.json({ error: 'PDF vide ou illisible.' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant intelligent qui résume des documents PDF.',
        },
        {
          role: 'user',
          content: `Voici un document PDF. Résume-le de manière claire et concise :\n\n${content}`,
        },
      ],
      temperature: 0.5,
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Erreur API /summary :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
