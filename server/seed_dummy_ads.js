import bcrypt from 'bcrypt';
import pool from './db.js';

const IMAGES = {
  big_ass: [
    'https://i.pinimg.com/736x/9d/14/24/9d14241effb067500a13babbed5dc0cc.jpg', 'https://i.pinimg.com/736x/fc/3b/84/fc3b84d80d7a2d5ed50ba03761813b4b.jpg', 'https://i.pinimg.com/736x/f1/5d/eb/f15deb09a61e605fd09a0ff9b5c64df6.jpg', 'https://i.pinimg.com/736x/5b/fd/0b/5bfd0b2fe469594c27c73e0c9da144e1.jpg', 'https://i.pinimg.com/736x/63/06/24/630624171172cdf3628bfb5ac0458622.jpg', 'https://i.pinimg.com/736x/84/6a/3d/846a3df9ee0bed7db9b595fd06970117.jpg', 'https://i.pinimg.com/736x/5c/05/c8/5c05c8ec6a27fa16e5c10defab1d7ab4.jpg', 'https://i.pinimg.com/736x/26/3e/9e/263e9ea29c6993e3e0ad3fb152a239ac.jpg', 'https://i.pinimg.com/736x/93/80/52/938052c663e281c7a19f9efd523d4bd4.jpg', 'https://i.pinimg.com/736x/21/bc/a5/21bca568371d7393cdacd5ca147a41f6.jpg', 'https://i.pinimg.com/736x/d6/1d/46/d61d469d6ac25f4e59bc68d6f5bc787d.jpg', 'https://i.pinimg.com/736x/7e/79/9a/7e799aaa1554c9f01117c406ad28d4f4.jpg', 'https://i.pinimg.com/736x/2b/d2/e1/2bd2e15f840e57ec448157b3f99027fa.jpg', 'https://i.pinimg.com/736x/68/c6/ff/68c6ff554f77ea92cd6cfb0946c9ba8c.jpg', 'https://i.pinimg.com/736x/49/06/4a/49064a679e589eac8b88b4d3da1459e7.jpg'
  ],
  black: [
    'https://i.pinimg.com/736x/8b/74/3d/8b743d3bfab7b9ae28372aa37f80a67f.jpg', 'https://i.pinimg.com/736x/95/1f/f8/951ff8e34655abfa1481b6a35f1e217a.jpg', 'https://i.pinimg.com/736x/15/1d/fa/151dfaf50a60e8c2bdbedf2789fb81c9.jpg', 'https://i.pinimg.com/736x/a1/81/3d/a1813d4d6bd25b2f512c6b4d37d573bc.jpg', 'https://i.pinimg.com/736x/b1/de/5c/b1de5c4e22b0c343197003cea324b45c.jpg', 'https://i.pinimg.com/736x/ea/3c/1c/ea3c1c7c6a2d3ac01628171705604bb5.jpg', 'https://i.pinimg.com/736x/4a/14/ea/4a14eaa5234c64fd9d1c4af6f32d095b.jpg', 'https://i.pinimg.com/736x/34/ef/3c/34ef3c9af004ddafa92f8b07b71195ea.jpg', 'https://i.pinimg.com/736x/21/0c/5c/210c5c541ac44f7511aaf0c96ae8534f.jpg', 'https://i.pinimg.com/736x/a3/81/41/a38141798a09d5720f998aecd49003a9.jpg', 'https://i.pinimg.com/736x/15/0c/72/150c7224689a727cedf613c9e6aef6ac.jpg', 'https://i.pinimg.com/736x/0e/a1/19/0ea119653acca1e69605e6218e2c3708.jpg', 'https://i.pinimg.com/736x/4c/ec/b5/4cecb558da4988ffec4b88b351070662.jpg', 'https://i.pinimg.com/736x/0f/e7/85/0fe785377dc776bea508df0cbd560ef9.jpg', 'https://i.pinimg.com/736x/47/67/d5/4767d5c662865f53890a58fea4159eb8.jpg'
  ],
  latin: [
    'https://i.pinimg.com/736x/b6/ec/85/b6ec85be9c5a41cd707f80aa5995c7b6.jpg', 'https://i.pinimg.com/736x/2e/fb/5b/2efb5b4e9659db02795e3705c3d8ca46.jpg', 'https://i.pinimg.com/736x/e3/51/5d/e3515de834d89d267c643796d086f458.jpg', 'https://i.pinimg.com/736x/08/c1/ee/08c1ee26f9b112c4f6ef977faaf88c80.jpg', 'https://i.pinimg.com/736x/7c/95/a2/7c95a26c0a13c05b0d8e06b0f5f68cfb.jpg', 'https://i.pinimg.com/736x/a6/ed/e8/a6ede8cebd8f157e8b9cfc9201857db4.jpg', 'https://i.pinimg.com/736x/f0/23/e8/f023e875746ec71fafd79b8ebd7dec1b.jpg', 'https://i.pinimg.com/736x/4b/07/24/4b07242fd1b95858d38003472861e589.jpg', 'https://i.pinimg.com/736x/57/ca/8f/57ca8fc8ed53388ae9032a4df7f06234.jpg', 'https://i.pinimg.com/736x/86/51/64/86516496f2fbd43c89f03f6b3dcb7064.jpg', 'https://i.pinimg.com/736x/70/ef/61/70ef61306c8dbba6d792bf800b9f326f.jpg', 'https://i.pinimg.com/736x/af/ad/f8/afadf81dd23babac58f6715e3df65fc1.jpg', 'https://i.pinimg.com/736x/3e/8b/d8/3e8bd8db5ebb81dc00abb310b0b152dd.jpg', 'https://i.pinimg.com/736x/1f/5d/ac/1f5dac05b11a8857aa90f65619e9e797.jpg', 'https://i.pinimg.com/736x/10/32/94/1032941feaf51828d9c3c22aed706ce2.jpg'
  ],
  asian: [
    'https://i.pinimg.com/736x/94/09/d2/9409d26e5e9df35e1dd4095b6c5f7f9e.jpg', 'https://i.pinimg.com/736x/4d/d5/51/4dd551a6c81b3bc300a4b7cc74faa4f1.jpg', 'https://i.pinimg.com/736x/4c/6d/71/4c6d71ab759c3b816709de5f7530a019.jpg', 'https://i.pinimg.com/736x/86/b2/a6/86b2a61632f83e87ef4a77848b1a6eca.jpg', 'https://i.pinimg.com/736x/d2/14/9d/d2149d8604253450c08f563011808b3d.jpg', 'https://i.pinimg.com/736x/94/13/69/941369fc8c1811ef888341284517656e.jpg', 'https://i.pinimg.com/736x/5c/2e/d5/5c2ed55e92bd78449e2a0cc257d832a0.jpg', 'https://i.pinimg.com/736x/cd/4f/a6/cd4fa6f80206cfb4f931095fff7e6199.jpg', 'https://i.pinimg.com/736x/7d/f7/ef/7df7eff4a2f65d8df42b9138c5396cf7.jpg', 'https://i.pinimg.com/736x/c3/1b/31/c31b31cb3577dc5c230b9704fb18137d.jpg', 'https://i.pinimg.com/736x/9e/4b/3d/9e4b3d7f5168a155944ebc2e846f761f.jpg', 'https://i.pinimg.com/736x/06/b7/cb/06b7cb0b03e32ce1a4a3e51d3e849b0a.jpg', 'https://i.pinimg.com/736x/6e/d0/e7/6ed0e75b25102eb4ff1b8eb53e7f807a.jpg', 'https://i.pinimg.com/736x/b4/85/26/b4852611947e27c6659beb4d1fbecc4b.jpg', 'https://i.pinimg.com/736x/40/5d/60/405d606262dbd554b790cdf9e131aa70.jpg'
  ],
  athletic: [
    'https://i.pinimg.com/736x/c7/09/f1/c709f1d4c8ea8c49862674e181c8ab1a.jpg', 'https://i.pinimg.com/736x/09/e9/0e/09e90e4b1f9b7a5daf2307902eb6bd0f.jpg', 'https://i.pinimg.com/736x/f3/a3/07/f3a307946444d0ae03418673f7774653.jpg', 'https://i.pinimg.com/736x/97/20/39/97203927a0e7b3f0b376839c6ac75928.jpg', 'https://i.pinimg.com/736x/8c/33/4e/8c334ec039fc7e9ae952925963a2482f.jpg', 'https://i.pinimg.com/736x/63/e1/eb/63e1eb37488289ef2c7d832f6c20ca63.jpg', 'https://i.pinimg.com/736x/e1/ed/a8/e1eda89af738d6fca5165ee39dd7b99a.jpg', 'https://i.pinimg.com/736x/f6/35/03/f63503be4af40d4fe2ec955a4b6030f0.jpg', 'https://i.pinimg.com/736x/6d/fa/2e/6dfa2efec3cfa0e5c8a1319e9d3e5760.jpg', 'https://i.pinimg.com/736x/43/1c/0a/431c0ae6e89005440882e8b9e185f2f8.jpg', 'https://i.pinimg.com/736x/f5/70/7c/f5707ccf766d4c17897c273b0f5944e2.jpg', 'https://i.pinimg.com/736x/31/7c/7e/317c7eb3d981a9023a3b4bea85905b7b.jpg', 'https://i.pinimg.com/736x/92/40/59/9240598de6cce5d7314006ddb7dd8e13.jpg', 'https://i.pinimg.com/736x/a1/0f/63/a10f63cbcfe71899640dd96a38689303.jpg', 'https://i.pinimg.com/736x/6c/77/c3/6c77c35958485a7da3962b232def2dbf.jpg'
  ],
  shower: [
    'https://i.pinimg.com/736x/d0/31/6b/d0316b2ae0840ec9419f09baf54ebf37.jpg', 'https://i.pinimg.com/736x/23/99/58/23995810511425105.jpg', 'https://i.pinimg.com/736x/a1/4f/e7/a14fe7d90f1ad392130cf621b10d9cdb.jpg', 'https://i.pinimg.com/736x/9b/44/13/9b4413c7479eb84f55603cb20f6e313b.jpg', 'https://i.pinimg.com/736x/9c/de/49/9cde49c8eb6662dba355e029e2bb5b85.jpg', 'https://i.pinimg.com/736x/88/e0/51/88e051ddff892c40382e2c24f5d4c2eb.jpg', 'https://i.pinimg.com/736x/45/87/a0/4587a025a7d4cfeffcda46c0073c74a0.jpg', 'https://i.pinimg.com/736x/a0/86/d0/a086d0504027a39a1572b6855cbf3496.jpg', 'https://i.pinimg.com/736x/ce/53/8e/ce538e16d6acfc0ce1440b49360b7359.jpg', 'https://i.pinimg.com/736x/b2/f3/79/b2f3792d001cf81b39a7dbb07eae34b2.jpg', 'https://i.pinimg.com/736x/4f/db/4e/4fdb4e3c8cedb41e75f11c8b76da7851.jpg', 'https://i.pinimg.com/736x/07/ed/06/07ed0639e67db31dc7c38451d16a4440.jpg', 'https://i.pinimg.com/736x/64/c5/ca/64c5cad49a5f7c6e69e103ebfc0537f3.jpg', 'https://i.pinimg.com/736x/5b/bf/8c/5bbf8cd0ff29d9dc11070bd17f359608.jpg', 'https://i.pinimg.com/736x/fb/25/8c/fb258c6da82c0191cf8fafcc84cdf036.jpg'
  ]
};

const NAMES = ['Sarah', 'Bella', 'Chloe', 'Tiffany', 'Monica', 'Jessica', 'Amber', 'Lisa', 'Naomi', 'Rachel', 'Sophie', 'Nora', 'Elena', 'Maya', 'Zara', 'Lily', 'Ava', 'Grace', 'Ivy', 'Ruby', 'Vanessa', 'Brenda', 'Shayla', 'Keisha', 'Latoya', 'Yuki', 'Mei', 'Carmen', 'Pilar', 'Jade', 'Sienna', 'Brooklyn', 'Trinity', 'Destiny', 'Faith', 'Hope', 'Joy', 'Aria', 'Luna', 'Nova'];

function generateDescription(name, telegram, phone) {
  const templates = [
    `I ${name} A PROFESSIONAL HOOKER 100% LEGIT I'm Available For InCall and OutCallS. I'll SATISFY you with m y full service such as Oral, Doggy, ****, 69., Girlfriend Experience,Bare and Covered ****, Couples Date,69, Nudes Live Video for $30, protection fee $65 via cashapp or PayPal HardCore, Car-Date Nuru Massage,• ****, HandJob. I can ride your cock till you beg me to stop I am always available, germs free fully vaccinated 100 % legit lady I sell hot 🥵 pics and videos [CONTENTS] for cheap prices FaceTime video fuck for cheap prices also h AVAILABLE NOW ACTIVE NOW TEXT ME ${phone} Add me on TELEGRAM: ${telegram}`,
    `ALWAYAS ACTIVE AND READY! I'm ${name}, your 100% legit companion. Offering full service: Oral, Doggy, GFE, and more. Satisfaction guaranteed! Nudes/Content available via Cashapp/PayPal. Available for InCall/OutCall. I'm vaccinated and clean. Text me now at ${phone} or find me on Telegram: ${telegram}. Let's have fun! 🥵`,
    `Looking for real fun? I'm ${name}, available 24/7 for In/Out calls. Oral, deepthroat, 69, and hardcore available. Also selling premium content and FaceTime sessions. Fast response! Cashapp/PayPal accepted. Text: ${phone} Telegram: ${telegram}. Legit only, no time wasters!`,
    `I'm ${name}, a professional and discreet lady. Available for GFE, Nuru, and full service fun. Couples welcome! I'm clean, vaccinated, and ready to ride. Content for sale for cheap prices. TEXT ME ${phone} or Add on Telegram: ${telegram}. Available NOW! 💦`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('dummy123', 10);
    
    // Get all cities
    const [cities] = await pool.query('SELECT id, name FROM cities');
    if (cities.length === 0) {
      console.error('No cities found in DB. Please seed locations first.');
      process.exit(1);
    }

    console.log(`Found ${cities.length} cities to distribute ads.`);

    const categories = Object.keys(IMAGES);
    let adCount = 0;

    for (const category of categories) {
      const categoryImages = IMAGES[category];
      console.log(`Processing category: ${category} (${categoryImages.length} images)`);

      for (let i = 0; i < categoryImages.length; i++) {
        const name = NAMES[adCount % NAMES.length];
        const email = `escort_${name.toLowerCase()}_${adCount}@digitalowl.test`;
        const phone = `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
        const telegram = `@${name.toLowerCase()}_${Math.floor(Math.random() * 999)}`;
        const city = cities[adCount % cities.length];
        const photoUrl = categoryImages[i];
        const description = generateDescription(name, telegram, phone);
        const title = `🔥 100% LEGIT ${name.toUpperCase()} - ${category.replace('_', ' ').toUpperCase()} 🔥`;
        const age = 20 + Math.floor(Math.random() * 10);

        // 1. Create User
        let userId;
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
          userId = existingUsers[0].id;
        } else {
          const [userResult] = await pool.query(
            'INSERT INTO users (email, password, alias, role) VALUES (?, ?, ?, "escort")',
            [email, passwordHash, name]
          );
          userId = userResult.insertId;
        }

        // 2. Create Ad (as JSON array for photo_url)
        const photoUrlJson = JSON.stringify([photoUrl]);
        
        await pool.query(
          'INSERT INTO ads (user_id, title, description, age, city_id, photo_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
          [userId, title, description, age, city.id, photoUrlJson]
        );

        adCount++;
      }
    }

    console.log(`--- SEEDING COMPLETED: Created ${adCount} diverse featured profiles! ---`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
