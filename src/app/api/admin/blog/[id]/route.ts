import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const blogPostUpdateSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").optional(),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones").optional(),
  excerpt: z.string().min(20, "El extracto debe tener al menos 20 caracteres").optional(),
  content: z.string().min(100, "El contenido debe tener al menos 100 caracteres").optional(),
  image: z.string().url("La imagen debe ser una URL válida").optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  category: z.string().min(2, "La categoría es obligatoria").optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readTime: z.number().min(1).max(60).optional(),
});

// Middleware para verificar autenticación
async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    
    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.adminId,
        active: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });

    return admin;
  } catch (error) {
    return null;
  }
}

// GET - Obtener un post específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "ID de post inválido" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });

  } catch (error) {
    console.error('Error obteniendo post del blog:', error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un post específico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "ID de post inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostUpdateSchema.parse(body);

    // Verificar que el post existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Si se está actualizando el slug, verificar que no exista otro post con el mismo slug
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, message: "Ya existe un post con ese slug" },
          { status: 400 }
        );
      }
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post actualizado exitosamente",
      post: updatedPost,
    });

  } catch (error) {
    console.error('Error actualizando post del blog:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Datos inválidos", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un post específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "ID de post inválido" },
        { status: 400 }
      );
    }

    // Verificar que el post existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post no encontrado" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: "Post eliminado exitosamente",
    });

  } catch (error) {
    console.error('Error eliminando post del blog:', error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}