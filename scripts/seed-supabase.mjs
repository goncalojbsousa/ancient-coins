import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';


// ============================================================
// 1. CARREGAMENTO DA CONFIGURACAO E DOS DADOS
// ============================================================

// Carrega as variaveis do ficheiro .env para process.env.
try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

// O URL nao e secreto. A chave secreta continua guardada no .env.
const supabaseUrl = 'https://msfnbmjnrvdmrjovbndl.supabase.co';
const secretKey = process.env.SUPABASE_SECRET_KEY;
const seedData = JSON.parse(await readFile(new URL('../src/assets/data/seed-data.json', import.meta.url), 'utf8'));

if (!secretKey) {
  console.log('Seed ignorada: falta SUPABASE_SECRET_KEY.');
  process.exit(0);
}


// ============================================================
// 2. LIGACAO AO SUPABASE
// ============================================================

const supabase = createClient(supabaseUrl, secretKey);

// Relaciona os IDs presentes no JSON com os IDs reais criados na tabela public.users.
const userIds = new Map();


// ============================================================
// 3. VERIFICACAO E EXECUCAO DA SEED
// ============================================================

// Se ja existir uma moeda, assume que a seed ja foi executada.
const { count, error: countError } = await supabase
  .from('coins')
  .select('id', { count: 'exact', head: true });

if (countError) {
  throw countError;
}

if (count > 0) {
  console.log('Seed ignorada: a base de dados ja tem moedas.');
  process.exit(0);
}

// A ordem e importante porque os restantes dados dependem dos utilizadores.
await seedUsers();
await seedCoins();
await seedConversations();
await seedReviews();

console.log('Seed aplicada ao Supabase.');


// ============================================================
// 4. SEED DOS UTILIZADORES
// ============================================================

async function seedUsers() {
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    throw authError;
  }

  for (const user of seedData.users) {
    let authUser = authData.users.find((item) => item.email === user.email);

    if (!authUser) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          location: user.location,
        },
      });

      if (error) {
        throw error;
      }

      authUser = data.user;
    }

    // O trigger cria automaticamente o perfil na tabela public.users.
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', authUser.id)
      .single();

    if (error) {
      throw error;
    }

    // Guarda a correspondencia entre o ID do JSON e o ID da base de dados.
    userIds.set(user.id, data.id);
  }
}


// ============================================================
// 5. SEED DAS MOEDAS
// ============================================================

async function seedCoins() {
  const coins = seedData.coins.map((coin) => ({
    ...coin,
    owner_id: userIds.get(coin.owner_id),
  }));

  await insertRows('coins', coins);
}


// ============================================================
// 6. SEED DAS CONVERSAS E MENSAGENS
// ============================================================

async function seedConversations() {
  const conversations = seedData.conversations.map((conversation) => ({
    ...conversation,
    buyer_id: userIds.get(conversation.buyer_id),
    seller_id: userIds.get(conversation.seller_id),
    // As mensagens ficam guardadas dentro da conversa como JSON.
    // Os IDs dos remetentes sao convertidos para os IDs reais.
    messages: conversation.messages.map((message) => ({
      ...message,
      sender_id: userIds.get(message.sender_id),
    })),
  }));

  await insertRows('conversations', conversations);
}


// ============================================================
// 7. SEED DAS REVIEWS
// ============================================================

async function seedReviews() {
  const reviews = seedData.reviews.map((review) => ({
    ...review,
    reviewer_id: userIds.get(review.reviewer_id),
    reviewed_user_id: userIds.get(review.reviewed_user_id),
  }));

  await insertRows('reviews', reviews);
}


// ============================================================
// 8. INSERCAO DOS REGISTOS
// ============================================================

async function insertRows(table, rows) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase
    .from(table)
    .insert(rows);

  if (error) {
    throw error;
  }
}
