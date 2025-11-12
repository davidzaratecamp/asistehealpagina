import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { executeQuery } from '@/lib/mysql';

const reviewSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  rating: z.number().min(1, "Debes calificar con al menos 1 estrella").max(5, "Máximo 5 estrellas"),
  comment: z.string().min(10, "El comentario debe tener al menos 10 caracteres").max(500, "Máximo 500 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = reviewSchema.parse(body);
    const { name, email, rating, comment } = validatedData;

    // Guardar la reseña en la base de datos
    const result = await executeQuery(
      'INSERT INTO reviews (name, email, rating, comment, approved) VALUES (?, ?, ?, ?, ?)',
      [name, email, rating, comment, true]
    ) as any;
    
    const review = { id: result.insertId, name, email, rating, comment, approved: true };

    // Solo enviar email si las credenciales SMTP están configuradas correctamente
    const hasValidSMTP = process.env.SMTP_USER && 
                         process.env.SMTP_PASS && 
                         process.env.SMTP_USER !== 'desarrollo@asistehealthcare.com';

    if (hasValidSMTP) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const stars = '⭐'.repeat(rating);
        
        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          subject: 'Nueva Reseña de Cliente - Asiste Health Care',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Nueva Reseña de Cliente</h1>
                <div style="color: white; font-size: 32px; margin-top: 10px;">${stars}</div>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1e3a8a; margin-top: 0;">Información del Cliente</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Nombre:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                      <a href="mailto:${email}" style="color: #1e3a8a; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Calificación:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${rating}/5 estrellas ${stars}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151;">Fecha:</td>
                    <td style="padding: 10px 0; color: #6b7280;">${new Date().toLocaleString('es-ES', { 
                      timeZone: 'America/New_York',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                  </tr>
                </table>

                <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #1e3a8a;">
                  <h3 style="margin: 0; color: #1e3a8a; font-weight: bold;">Comentario del Cliente:</h3>
                  <p style="margin: 15px 0 0 0; color: #374151; line-height: 1.6; font-style: italic;">
                    "${comment}"
                  </p>
                </div>

                <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #1e3a8a;">
                  <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Próximos pasos:</p>
                  <p style="margin: 10px 0 0 0; color: #374151;">
                    Reseña guardada en la base de datos con ID: ${review.id}. Revisar y aprobar para publicar en el sitio web.
                  </p>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
                <p>Este email fue enviado automáticamente desde asistehealtcare.com</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email de reseña enviado correctamente');
      } catch (emailError) {
        console.warn('Error enviando email de reseña (reseña guardada correctamente):', emailError);
        // No fallar la operación si el email falla
      }
    } else {
      console.log('SMTP no configurado - reseña guardada sin notificación por email');
    }

    return NextResponse.json(
      { success: true, message: "Reseña recibida" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en el endpoint de reseñas:', error);
    
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

export async function GET() {
  try {
    const approvedReviews = await executeQuery(
      'SELECT id, name, rating, comment, createdAt FROM reviews WHERE approved = 1 ORDER BY createdAt DESC'
    ) as any[];

    return NextResponse.json({
      success: true,
      reviews: approvedReviews,
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json(
      { success: false, message: "Error al obtener reseñas" },
      { status: 500 }
    );
  }
}