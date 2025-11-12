import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

// GET - Obtener posts publicados del blog (API pública)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    const skip = (page - 1) * limit;

    // Construir query params
    const queryParams: any[] = [];
    let whereConditions = ['bp.published = 1'];
    
    if (category) {
      whereConditions.push('bp.category = ?');
      queryParams.push(category);
    }
    
    if (featured === 'true') {
      whereConditions.push('bp.featured = 1');
    }

    const whereClause = 'WHERE ' + whereConditions.join(' AND ');

    // Usar query directo para evitar problemas con prepared statements
    const postsQuery = `SELECT bp.id, bp.title, bp.slug, bp.excerpt, bp.image, bp.category, 
                       bp.tags, bp.readTime, bp.views, bp.featured, bp.createdAt, 
                       a.name as authorName, a.username as authorUsername 
                       FROM blog_posts bp LEFT JOIN admins a ON bp.authorId = a.id 
                       ${whereClause} ORDER BY bp.featured DESC, bp.createdAt DESC 
                       LIMIT ${limit} OFFSET ${skip}`;
    
    const countQuery = `SELECT COUNT(*) as total FROM blog_posts bp ${whereClause}`;

    const [posts, totalResult] = await Promise.all([
      executeQuery(postsQuery, queryParams) as Promise<any[]>,
      executeQuery(countQuery, queryParams) as Promise<any[]>
    ]);

    const total = totalResult[0]?.total || 0;

    // Formatear posts para incluir author como objeto
    const formattedPosts = posts.map(post => ({
      ...post,
      author: {
        name: post.authorName,
        username: post.authorUsername
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