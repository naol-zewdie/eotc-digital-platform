import { PrismaClient, UserRole, ContentStatus, RightsStatus, ArticleType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial EOTC Platform dataset...');

  // 1. Initial Categories
  const catLiturgy = await prisma.category.upsert({
    where: { slug: 'liturgy' },
    update: {},
    create: {
      slug: 'liturgy',
      nameAm: 'ስርዓተ አምልኮና ቅዳሴ',
      nameGez: 'ሥርዓተ ጸሎት ወቅዳሴ',
      nameEn: 'Liturgy & Worship',
    },
  });

  const catPatristics = await prisma.category.upsert({
    where: { slug: 'patristics' },
    update: {},
    create: {
      slug: 'patristics',
      nameAm: 'የአበው ሊቃውንት አስተምህሮ',
      nameGez: 'ሃይማኖተ አበው',
      nameEn: 'Patristics & Church Fathers',
    },
  });

  const catMezmurZemeneTsigie = await prisma.category.upsert({
    where: { slug: 'zemene-tsigie' },
    update: {},
    create: {
      slug: 'zemene-tsigie',
      nameAm: 'የዘመነ ጽጌ መዝሙራት',
      nameGez: 'ማኅሌተ ጽጌ',
      nameEn: 'Season of Flowers Hymns',
    },
  });

  // 2. Rights Record (Section 14)
  const publicDomainRights = await prisma.rightsRecord.create({
    data: {
      status: RightsStatus.PUBLIC_DOMAIN,
      rightsHolder: 'Ethiopian Orthodox Tewahedo Church Tradition',
      source: 'Ancient Liturgical Manuscripts',
      permissionReference: 'Historic Canon',
      downloadAllowed: true,
      notes: 'Preserved public domain liturgical heritage.',
    },
  });

  // 3. Super Administrator User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eotc-platform.org' },
    update: {},
    create: {
      email: 'admin@eotc-platform.org',
      displayName: 'EOTC Patriarchate Administrator',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummyhashforseed$samplehash',
      role: UserRole.SUPER_ADMINISTRATOR,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  // 4. Sample Church (Debre Libanos)
  const churchDebreLibanos = await prisma.church.upsert({
    where: { slug: 'debre-libanos' },
    update: {},
    create: {
      slug: 'debre-libanos',
      region: 'Oromia',
      city: 'North Shewa',
      status: ContentStatus.PUBLISHED,
      translations: {
        create: [
          {
            locale: 'am',
            name: 'ደብረ ሊባኖስ ገዳም',
            description: 'በ13ኛው ክፍለ ዘመን በጻድቁ አቡነ ተክለ ሃይማኖት የተመሠረተ ታላቅ ገዳም።',
            history: 'ደብረ ሊባኖስ በኢትዮጵያ ታሪክ ውስጥ የመንፈሳዊ ዕውቀትና የቅርስ ጥበቃ ማዕከል ሆኖ አገልግሏል።',
          },
          {
            locale: 'en',
            name: 'Debre Libanos Monastery',
            description: 'Historic monastery founded in the 13th century by Saint Abune Tekle Haymanot.',
            history: 'Debre Libanos is one of the most prominent monastic and scholarly centers in Ethiopia.',
          },
        ],
      },
    },
  });

  // 5. Sample Book (Metsihafe Qidassie)
  const bookQidassie = await prisma.book.upsert({
    where: { slug: 'metsihafe-qidassie' },
    update: {},
    create: {
      slug: 'metsihafe-qidassie',
      categoryId: catLiturgy.id,
      rightsId: publicDomainRights.id,
      publicationYear: 1998,
      status: ContentStatus.PUBLISHED,
      pageCount: 412,
      translations: {
        create: [
          {
            locale: 'am',
            title: 'መጽሐፈ ቅዳሴ (ግዕዝና አማርኛ)',
            description: 'የአስራ አራቱ ቅዳሴያት ጸሎትና ስርዓት በአንድነት የተካተቱበት።',
            authorDisplayName: 'ሊቃውንተ ቤተክርስቲያን',
          },
          {
            locale: 'en',
            title: 'The Book of Divine Liturgy',
            description: 'Complete text of the fourteen Anaphoras of the Ethiopian Orthodox Tewahedo Church.',
            authorDisplayName: 'Church Fathers',
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
