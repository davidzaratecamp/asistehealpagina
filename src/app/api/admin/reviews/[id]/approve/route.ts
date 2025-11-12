import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { approved: true },
    });

    return NextResponse.json({
      success: true,
      message: "Reseña aprobada correctamente",
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error al aprobar reseña:', error);
    return NextResponse.json(
      { success: false, message: "Error al aprobar reseña" },
      { status: 500 }
    );
  }
}