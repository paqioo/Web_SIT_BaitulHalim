const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const landing = await prisma.landingImage.findMany();
  console.log("LANDING IMAGES:", landing);
  
  const gallery = await prisma.gallery.findMany();
  console.log("GALLERY:", gallery.map(g => g.fotoUrl));
}

main().catch(console.error).finally(() => prisma.$disconnect());
