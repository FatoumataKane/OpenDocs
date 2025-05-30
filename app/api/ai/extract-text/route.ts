import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Fichier non valide' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    return NextResponse.json({ text: parsed.text });
  } catch (err) {
    console.error('❌ Erreur extract-text:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
