import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql';

// GET - Obtener un post específico por slug (API pública)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const postResults = await executeQuery(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.image, 
        bp.category, bp.tags, bp.metaTitle, bp.metaDescription, 
        bp.readTime, bp.views, bp.featured, bp.createdAt, bp.updatedAt,
        a.name as authorName, a.username as authorUsername
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.authorId = a.id
      WHERE bp.slug = ? AND bp.published = 1
    `, [slug]) as any[];

    const post = postResults.length > 0 ? {
      ...postResults[0],
      author: {
        name: postResults[0].authorName,
        username: postResults[0].authorUsername
      }
    } : null;

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post no encontrado" },
        { status: 404 }
      );
    }

    // Incrementar las vistas del post
    await executeQuery(
      'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
      [post.id]
    );

    // Obtener posts relacionados (misma categoría)
    const relatedPostsResults = await executeQuery(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.image, 
        bp.category, bp.readTime, bp.createdAt,
        a.name as authorName
      FROM blog_posts bp
      LEFT JOIN admins a ON bp.authorId = a.id
      WHERE bp.published = 1 AND bp.category = ? AND bp.id != ?
      ORDER BY bp.createdAt DESC
      LIMIT 3
    `, [post.category, post.id]) as any[];

    const relatedPosts = relatedPostsResults.map(relatedPost => ({
      ...relatedPost,
      author: {
        name: relatedPost.authorName
      }
    }));

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        views: post.views + 1, // Reflejar el incremento
      },
      relatedPosts,
    });

  } catch (error) {
    console.error('Error obteniendo post del blog:', error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}