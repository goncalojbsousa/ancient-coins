import { readFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

await loadEnvFile();

const environmentText = await readFile(new URL('../src/environments/environment.ts', import.meta.url), 'utf8');
const seedData = JSON.parse(await readFile(new URL('../src/assets/data/seed-data.json', import.meta.url), 'utf8'));

const supabaseUrl = process.env.SUPABASE_URL ?? getEnvironmentValue('supabaseUrl');
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secretKey) {
  console.warn('Seed ignorada: falta SUPABASE_SECRET_KEY no ficheiro .env.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const userIds = new Map();

await skipIfAlreadySeeded();
await seedUsers();
await seedCoins();
await seedConversations();
await seedReviews();

console.log('Seed JSON aplicada ao Supabase.');

async function loadEnvFile() {
  try {
    const envText = await readFile(new URL('../.env', import.meta.url), 'utf8');

    for (const line of envText.split(/\r?\n/)) {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.+?)\s*$/);

      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

function getEnvironmentValue(name) {
  const match = environmentText.match(new RegExp(`${name}:\\s*['"]([^'"]+)['"]`));

  if (!match) {
    throw new Error(`Nao foi encontrada a configuracao ${name} no environment.ts.`);
  }

  return match[1];
}

async function skipIfAlreadySeeded() {
  const { count, error } = await supabase
    .from('coins')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  if (count && count > 0) {
    console.log('Seed JSON ignorada: a base de dados ja tem moedas.');
    process.exit(0);
  }
}

async function seedUsers() {
  const authUsers = await getAuthUsers();

  for (const user of seedData.users) {
    let authUser = authUsers.find((item) => item.email === user.email);

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

    const { data, error } = await supabase
      .from('users')
      .upsert({
        auth_id: authUser.id,
        name: user.name,
        email: user.email,
        location: user.location,
        rating: user.rating ?? 0,
        total_reviews: user.totalReviews ?? 0,
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    userIds.set(user.id, data.id);
  }
}

async function getAuthUsers() {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  return data.users;
}

async function seedCoins() {
  const coins = seedData.coins.map((coin) => ({
    id: coin.id,
    owner_id: userIds.get(coin.ownerId),
    name: coin.name,
    origin: coin.origin,
    year: coin.year,
    material: coin.material,
    condition: coin.condition,
    description: coin.description,
    photos: coin.photos,
    available_for_sale: coin.availableForSale,
    available_for_trade: coin.availableForTrade,
    price: coin.price ?? null,
    trade_preference: coin.tradePreference ?? null,
    created_at: coin.createdAt,
    updated_at: coin.updatedAt,
  }));

  await insertRows('coins', coins);
}

async function seedConversations() {
  const conversations = seedData.conversations.map((conversation) => ({
    id: conversation.id,
    coin_id: conversation.coinId,
    buyer_id: userIds.get(conversation.buyerId),
    seller_id: userIds.get(conversation.sellerId),
    status: conversation.status,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      sender_id: userIds.get(message.senderId),
      text: message.text,
      created_at: message.createdAt,
    })),
    created_at: conversation.createdAt,
    updated_at: conversation.updatedAt,
  }));

  await insertRows('conversations', conversations);
}

async function seedReviews() {
  const reviews = seedData.reviews.map((review) => ({
    id: review.id,
    conversation_id: review.conversationId,
    reviewer_id: userIds.get(review.reviewerId),
    reviewed_user_id: userIds.get(review.reviewedUserId),
    stars: review.stars,
    comment: review.comment,
    created_at: review.createdAt,
  }));

  await insertRows('reviews', reviews);
}

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
