import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

export async function GET() {
  try {
    const reviews = await executeQuery(
      'SELECT id, name, email, rating, comment, approved, createdAt, updatedAt FROM reviews ORDER BY createdAt DESC'
    ) as any[];

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Error al obtener reseñas para admin:', error);
    return NextResponse.json(
      { success: false, message: "Error al obtener reseñas" },
      { status: 500 }
    );
  }
}