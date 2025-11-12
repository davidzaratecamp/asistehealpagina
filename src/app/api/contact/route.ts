import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { executeQuery } from '@/lib/mysql';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  email: z.string().email("Correo electrónico inválido"),
  postalCode: z.string().regex(/^\d{5}$/, "Código postal debe tener 5 dígitos"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = contactSchema.parse(body);
    const { name, phone, email, postalCode } = validatedData;

    // Guardar el contacto en la base de datos
    const result = await executeQuery(
      'INSERT INTO contacts (name, phone, email, postalCode) VALUES (?, ?, ?, ?)',
      [name, phone, email, postalCode]
    ) as any;
    
    const contact = { id: result.insertId, name, phone, email, postalCode };

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

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          subject: 'Nuevo contacto desde Asiste Health Care',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Nuevo Contacto - Asiste Health Care</h1>
              </div>
              
              <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1e3a8a; margin-top: 0;">Información del Cliente</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Nombre:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Teléfono:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                      <a href="tel:${phone}" style="color: #1e3a8a; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
                      <a href="mailto:${email}" style="color: #1e3a8a; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Código Postal:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${postalCode}</td>
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

                <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #1e3a8a;">
                  <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Próximos pasos:</p>
                  <p style="margin: 10px 0 0 0; color: #374151;">
                    Contacto guardado en la base de datos con ID: ${contact.id}. Contactar al cliente dentro de las próximas 24 horas para brindar asesoría personalizada sobre seguros médicos.
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
        console.log('Email de contacto enviado correctamente');
      } catch (emailError) {
        console.warn('Error enviando email de contacto (contacto guardado correctamente):', emailError);
        // No fallar la operación si el email falla
      }
    } else {
      console.log('SMTP no configurado - contacto guardado sin notificación por email');
    }

    return NextResponse.json(
      { success: true, message: "Contacto recibido" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en el endpoint de contacto:', error);
    
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
  return NextResponse.json(
    { message: "Endpoint de contacto funcionando correctamente" },
    { status: 200 }
  );
}