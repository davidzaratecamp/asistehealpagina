import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { executeQuery } from '@/lib/mysql';

const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // Buscar el admin en la base de datos
    const adminRows = await executeQuery(
      'SELECT id, username, email, name, password, active FROM admins WHERE username = ? AND active = 1',
      [username]
    ) as any[];

    const admin = adminRows.length > 0 ? adminRows[0] : null;

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generar JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        email: admin.email,
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    // Preparar la respuesta sin la contraseña
    const { password: _, ...adminData } = admin;

    const response = NextResponse.json(
      {
        success: true,
        message: "Login exitoso",
        admin: adminData,
      },
      { status: 200 }
    );

    // Establecer el token como una cookie HTTP-only
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 horas
    });

    return response;

  } catch (error) {
    console.error('Error en login de admin:', error);
    
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

// Endpoint para logout
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logout exitoso" },
      { status: 200 }
    );

    // Eliminar la cookie del token
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    console.error('Error en logout de admin:', error);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para verificar el token
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No hay token de autenticación" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    
    // Verificar que el admin aún existe y está activo
    const adminRows = await executeQuery(
      'SELECT id, username, email, name, active FROM admins WHERE id = ? AND active = 1',
      [decoded.adminId]
    ) as any[];

    const admin = adminRows.length > 0 ? adminRows[0] : null;

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Token inválido" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, admin },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error verificando token de admin:', error);
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 401 }
    );
  }
}