const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBalls() {
  try {
    const count = await prisma.ball.count();
    console.log('Total balls in DB:', count);
    
    const firstFive = await prisma.ball.findMany({
      take: 5,
      select: { id: true, name: true, manufacturer: true }
    });
    console.log('First 5 balls:');
    firstFive.forEach(b => console.log(`  ${b.id} - ${b.manufacturer} ${b.name}`));
  } finally {
    await prisma.$disconnect();
  }
}

checkBalls();
