export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const envKeys = Object.keys(process.env).filter(k => 
    k.includes('DATABASE') || 
    k.includes('SUPABASE') || 
    k.includes('POSTGRES') || 
    k.includes('URL') || 
    k.includes('KV') || 
    k.includes('FIREBASE') || 
    k.includes('MONGO') ||
    k.includes('VERCEL') ||
    k.includes('ADMIN')
  );

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    matchingEnvKeys: envKeys,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasKvUrl: !!process.env.KV_REST_API_URL,
  });
}
