import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
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

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Reseña eliminada correctamente",
    });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar reseña" },
      { status: 500 }
    );
  }
}