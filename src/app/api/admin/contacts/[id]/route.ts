import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const deletedContact = await prisma.contact.delete({
      where: {
        id: contactId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Contacto eliminado correctamente",
      contact: deletedContact,
    });
  } catch (error: any) {
    console.error('Error al eliminar contacto:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: "Contacto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al eliminar contacto" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contactId = parseInt(id);

    if (isNaN(contactId)) {
      return NextResponse.json(
        { success: false, message: "ID inválido" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: "Contacto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return NextResponse.json(
      { success: false, message: "Error al obtener contacto" },
      { status: 500 }
    );
  }
}