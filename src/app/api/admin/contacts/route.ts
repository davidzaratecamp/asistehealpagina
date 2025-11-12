import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

export async function GET() {
  try {
    const contacts = await executeQuery(
      'SELECT id, name, phone, email, postalCode, createdAt FROM contacts ORDER BY createdAt DESC'
    ) as any[];

    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error('Error al obtener contactos para admin:', error);
    return NextResponse.json(
      { success: false, message: "Error al obtener contactos" },
      { status: 500 }
    );
  }
}