import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/mysql';

const blogPostSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  excerpt: z.string().min(20, "El extracto debe tener al menos 20 caracteres"),
  content: z.string().min(100, "El contenido debe tener al menos 100 caracteres"),
  image: z.string().url("La imagen debe ser una URL válida").optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  category: z.string().min(2, "La categoría es obligatoria"),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readTime: z.number().min(1).max(60).default(5),
});

// Middleware para verificar autenticación
async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    
    const adminRows = await executeQuery(
      'SELECT id, username, email, name FROM admins WHERE id = ? AND active = 1',
      [decoded.adminId]
    ) as any[];

    const admin = adminRows.length > 0 ? adminRows[0] : null;

    return admin;
  } catch (error) {
    return null;
  }
}

// GET - Obtener todos los posts del blog (con paginación)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const category = searchParams.get('category');
    
    const skip = (page - 1) * limit;

    // Construir condiciones WHERE
    let whereConditions = [];
    const queryParams = [];
    
    if (published !== null && published !== undefined) {
      whereConditions.push('bp.published = ?');
      queryParams.push(published === 'true' ? 1 : 0);
    }
    if (category) {
      whereConditions.push('bp.category = ?');
      queryParams.push(category);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Queries SQL
    const postsQuery = `SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.image,
                        bp.category, bp.tags, bp.metaTitle, bp.metaDescription, bp.readTime, 
                        bp.views, bp.published, bp.featured, bp.createdAt, bp.updatedAt,
                        a.id as authorId, a.username as authorUsername, a.name as authorName
                        FROM blog_posts bp 
                        LEFT JOIN admins a ON bp.authorId = a.id
                        ${whereClause}
                        ORDER BY bp.createdAt DESC
                        LIMIT ${limit} OFFSET ${skip}`;

    const countQuery = `SELECT COUNT(*) as total FROM blog_posts bp ${whereClause}`;

    const [posts, totalResult] = await Promise.all([
      executeQuery(postsQuery, queryParams) as Promise<any[]>,
      executeQuery(countQuery, queryParams) as Promise<any[]>
    ]);

    const total = totalResult[0]?.total || 0;

    // Formatear posts con autor
    const formattedPosts = posts.map(post => ({
      ...post,
      author: {
        id: post.authorId,
        username: post.authorUsername,
        name: post.authorName
      }
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error obteniendo posts del blog:', error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo post del blog
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Verificar que el slug no exista
    const existingPosts = await executeQuery(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [validatedData.slug]
    ) as any[];

    if (existingPosts.length > 0) {
      return NextResponse.json(
        { success: false, message: "Ya existe un post con ese slug" },
        { status: 400 }
      );
    }

    // Crear el nuevo post
    const insertResult = await executeQuery(
      `INSERT INTO blog_posts 
       (title, slug, excerpt, content, image, published, featured, category, tags, metaTitle, metaDescription, readTime, authorId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        validatedData.title,
        validatedData.slug,
        validatedData.excerpt,
        validatedData.content,
        validatedData.image || null,
        validatedData.published ? 1 : 0,
        validatedData.featured ? 1 : 0,
        validatedData.category,
        validatedData.tags || null,
        validatedData.metaTitle || null,
        validatedData.metaDescription || null,
        validatedData.readTime,
        admin.id
      ]
    ) as any;

    // Obtener el post creado con datos del autor
    const newPostResults = await executeQuery(
      `SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.image,
              bp.category, bp.tags, bp.metaTitle, bp.metaDescription, bp.readTime,
              bp.views, bp.published, bp.featured, bp.createdAt, bp.updatedAt,
              a.id as authorId, a.username as authorUsername, a.name as authorName
       FROM blog_posts bp
       LEFT JOIN admins a ON bp.authorId = a.id
       WHERE bp.id = ?`,
      [insertResult.insertId]
    ) as any[];

    const post = newPostResults.length > 0 ? {
      ...newPostResults[0],
      author: {
        id: newPostResults[0].authorId,
        username: newPostResults[0].authorUsername,
        name: newPostResults[0].authorName
      }
    } : null;

    return NextResponse.json(
      { success: true, message: "Post creado exitosamente", post },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creando post del blog:', error);
    
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