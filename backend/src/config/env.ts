import 'dotenv/config';

const parsedPort = Number.parseInt(process.env['PORT'] ?? '3000', 10);

if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}

export const env = {
  port: parsedPort,
  frontendOrigin: process.env['FRONTEND_ORIGIN'] ?? 'http://localhost:4200',
  supabaseUrl: process.env['SUPABASE_URL'],
  supabaseAnonKey: process.env['SUPABASE_ANON_KEY'],
};
