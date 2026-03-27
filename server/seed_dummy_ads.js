import bcrypt from 'bcrypt';
import pool from './db.js';

// Images are now dynamically loaded from the seed_images database table

const NAMES = ['Sarah', 'Bella', 'Chloe', 'Tiffany', 'Monica', 'Jessica', 'Amber', 'Lisa', 'Naomi', 'Rachel', 'Sophie', 'Nora', 'Elena', 'Maya', 'Zara', 'Lily', 'Ava', 'Grace', 'Ivy', 'Ruby', 'Vanessa', 'Brenda', 'Shayla', 'Keisha', 'Latoya', 'Yuki', 'Mei', 'Carmen', 'Pilar', 'Jade', 'Sienna', 'Brooklyn', 'Trinity', 'Destiny', 'Faith', 'Hope', 'Joy', 'Aria', 'Luna', 'Nova'];

function generateDescription(name, telegram, phone) {
  const templates = [
    `I'm ${name} A 100% LEGIT COMPANION. Available For InCall and OutCallS. Full service: Oral, GFE, 69, Nuru Massage, HardCore. Always clean, vaccinated and ready. I sell premium content & FaceTime sessions. TEXT ME ${phone} or TELEGRAM: ${telegram}. AVAILABLE NOW 🥵`,
    `ALWAYS ACTIVE AND READY! I'm ${name}, your 100% legit companion. Offering full service: Oral, Doggy, GFE, and more. Satisfaction guaranteed! Nudes/Content available via Cashapp/PayPal. Available for InCall/OutCall. I'm vaccinated and clean. Text me now at ${phone} or find me on Telegram: ${telegram}. Let's have fun! 🥵`,
    `Looking for real fun? I'm ${name}, available 24/7 for In/Out calls. Oral, deepthroat, 69, and hardcore available. Also selling premium content and FaceTime sessions. Fast response! Cashapp/PayPal accepted. Text: ${phone} Telegram: ${telegram}. Legit only, no time wasters!`,
    `I'm ${name}, a professional and discreet lady. Available for GFE, Nuru, and full service fun. Couples welcome! I'm clean, vaccinated, and ready to ride. Content for sale for cheap prices. TEXT ME ${phone} or Add on Telegram: ${telegram}. Available NOW! 💦`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export async function runSeed() {
  try {
    const passwordHash = await bcrypt.hash('dummy123', 10);

    // === STEP 1: Delete old dummy ads and their users safely ===
    console.log('Clearing old dummy ads and users...');
    const [dummyUsers] = await pool.query(`SELECT id FROM users WHERE email LIKE '%@digitalowl.test'`);
    if (dummyUsers.length > 0) {
      const dummyUserIds = dummyUsers.map(u => u.id);
      // Delete ads first (FK constraint)
      await pool.query(`DELETE FROM ads WHERE user_id IN (?)`, [dummyUserIds]);
      // Delete users
      await pool.query(`DELETE FROM users WHERE id IN (?)`, [dummyUserIds]);
    }
    console.log(`Cleared ${dummyUsers.length} old dummy accounts.`);

    // === STEP 2: Get all cities ===
    const [cities] = await pool.query('SELECT id, name FROM cities');
    if (cities.length === 0) {
      console.error('No cities found in DB. Please seed locations first.');
      throw new Error('No cities found in DB');
    }
    console.log(`Found ${cities.length} cities to distribute ads.`);

    // === STEP 2.5: Get curated images from seed_images table ===
    const [seedRows] = await pool.query('SELECT category, url FROM seed_images');
    if (seedRows.length === 0) {
      console.error('No images found in seed_images. Please initialize DB in Admin Panel first.');
      throw new Error('No images found in seed_images');
    }
    
    // Group images by category to match previous structure
    const dbImages = {};
    for (const row of seedRows) {
       if (!dbImages[row.category]) dbImages[row.category] = [];
       dbImages[row.category].push(row.url);
    }

    const categories = Object.keys(dbImages);
    let adCount = 0;

    // === STEP 3: Seed new ads with clean images ===
    for (const category of categories) {
      const categoryImages = dbImages[category];
      console.log(`Processing category: ${category} (${categoryImages.length} images)`);

      for (let i = 0; i < categoryImages.length; i++) {
        const name = NAMES[adCount % NAMES.length];
        const email = `escort_${name.toLowerCase()}_${adCount}@digitalowl.test`;
        const phone = `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
        const telegram = `@${name.toLowerCase()}_${Math.floor(Math.random() * 999)}`;
        const city = cities[adCount % cities.length];
        const photoUrl = categoryImages[i];
        const description = generateDescription(name, telegram, phone);
        const title = name;
        const age = 20 + Math.floor(Math.random() * 10);

        // Create User
        const [userResult] = await pool.query(
          'INSERT INTO users (email, password, alias, role) VALUES (?, ?, ?, "escort")',
          [email, passwordHash, name]
        );
        const userId = userResult.insertId;

        // Create Ad
        const photoUrlJson = JSON.stringify([photoUrl]);
        await pool.query(
          'INSERT INTO ads (user_id, title, description, age, city_id, photo_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
          [userId, title, description, age, city.id, photoUrlJson]
        );

        adCount++;
      }
    }

    console.log(`--- SEEDING COMPLETED: Created ${adCount} clean featured profiles! ---`);
  } catch (err) {
    console.error('Seeding error:', err);
    throw err;
  }
}
