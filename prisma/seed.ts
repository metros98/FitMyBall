import { PrismaClient, SpinLevel, LaunchLevel, FeelLevel, TempLevel, ComparisonLevel, SpinComparison, FeelComparison } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ========================================
  // CLEANUP (development only)
  // Delete in reverse order of foreign key dependencies
  // ========================================
  console.log('🗑️  Cleaning existing data...');

  await prisma.recommendationBall.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.userTriedBall.deleteMany();
  await prisma.userFavoriteBall.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ball.deleteMany();

  console.log('✅ Cleanup complete');

  // ========================================
  // SEED GOLF BALLS
  // ========================================

  console.log('⛳ Creating golf balls...');

  const balls = await Promise.all([
    // TITLEIST
    prisma.ball.create({
      data: {
        name: 'Pro V1',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-pro-v1',
        description: 'The #1 ball in golf, delivering total performance with optimal flight and consistent spin.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 54.99,
        msrp: 54.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.titleist.com/golf-balls/pro-v1',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Pro V1x',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-pro-v1x',
        description: 'High flight, spin, and stopping power for players who prefer a firmer feel.',
        construction: '4-piece',
        coverMaterial: 'Cast Urethane',
        layers: 4,
        compression: 98,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 54.99,
        msrp: 54.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.titleist.com/golf-balls/pro-v1x',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'AVX',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-avx',
        description: 'Premium performance with exceptionally soft feel and low spin on long shots.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 80,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.LOW,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 3,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 3,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.titleist.com/golf-balls/avx',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Tour Speed',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-tour-speed',
        description: 'Tour-proven distance and short game control with a penetrating flight.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 85,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.titleist.com/golf-balls/tour-speed',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'TruFeel',
        manufacturer: 'Titleist',
        modelYear: 2024,
        slug: 'titleist-trufeel',
        description: 'Soft feel with consistent ball flight for improved scoring.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 60,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White', 'Yellow', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.titleist.com/golf-balls/trufeel',
        productUrls: [],
      },
    }),

    // CALLAWAY
    prisma.ball.create({
      data: {
        name: 'Chrome Soft',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-chrome-soft',
        description: 'Tour-level performance with exceptional feel and greenside control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/chrome-soft',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Chrome Soft X',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-chrome-soft-x',
        description: 'High launch, low spin off the tee with exceptional workability.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/chrome-soft-x',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Supersoft',
        manufacturer: 'Callaway',
        modelYear: 2024,
        slug: 'callaway-supersoft',
        description: 'Ultra-low compression for maximum distance and soft feel.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 38,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.LOW,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White', 'Yellow', 'Orange', 'Pink', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.callawaygolf.com/golf-balls/supersoft',
        productUrls: [],
      },
    }),

    // TAYLORMADE
    prisma.ball.create({
      data: {
        name: 'TP5',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tp5',
        description: 'Complete tee-to-green performance with Tour Flight Dimple Pattern.',
        construction: '5-piece',
        coverMaterial: 'Cast Urethane',
        layers: 5,
        compression: 85,
        driverSpin: SpinLevel.MID,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.taylormadegolf.com/TP5-Golf-Balls',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'TP5x',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tp5x',
        description: 'Higher launch and more spin than TP5 for players seeking maximum distance.',
        construction: '5-piece',
        coverMaterial: 'Cast Urethane',
        layers: 5,
        compression: 97,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.taylormadegolf.com/TP5x-Golf-Balls',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Tour Response',
        manufacturer: 'TaylorMade',
        modelYear: 2024,
        slug: 'taylormade-tour-response',
        description: 'Tour performance at a value price with 100% urethane cover.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 70,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 3,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.taylormadegolf.com/Tour-Response-Golf-Balls',
        productUrls: [],
      },
    }),

    // BRIDGESTONE
    prisma.ball.create({
      data: {
        name: 'Tour B X',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-tour-b-x',
        description: 'Maximum distance and control for players with faster swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 105,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.FIRM,
        durability: 5,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 49.99,
        msrp: 49.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 5,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/tour-b-x',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Tour B RX',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-tour-b-rx',
        description: 'Enhanced feel and distance for moderate swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 76,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/tour-b-rx',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'e12 Contact',
        manufacturer: 'Bridgestone',
        modelYear: 2024,
        slug: 'bridgestone-e12-contact',
        description: 'Maximum distance with soft feel and straight ball flight.',
        construction: '3-piece',
        coverMaterial: 'Ionomer',
        layers: 3,
        compression: 60,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 5,
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 29.99,
        msrp: 29.99,
        availableColors: ['White', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.MODERATE,
        coldSuitability: 3,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.bridgestonegolf.com/en-us/golf-balls/e12-contact',
        productUrls: [],
      },
    }),

    // SRIXON
    prisma.ball.create({
      data: {
        name: 'Z-Star',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-z-star',
        description: 'Tour-level performance with exceptional greenside spin and control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 88,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.srixon.com/golf-balls/z-star',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Z-Star XV',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-z-star-xv',
        description: 'Maximum distance with firmer feel for higher swing speeds.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 102,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 44.99,
        msrp: 44.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 5,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.srixon.com/golf-balls/z-star-xv',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Q-Star Tour',
        manufacturer: 'Srixon',
        modelYear: 2024,
        slug: 'srixon-q-star-tour',
        description: 'Tour performance at a value price with soft urethane cover.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 72,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 3,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.srixon.com/golf-balls/q-star-tour',
        productUrls: [],
      },
    }),

    // VICE
    prisma.ball.create({
      data: {
        name: 'Pro Plus',
        manufacturer: 'Vice',
        modelYear: 2024,
        slug: 'vice-pro-plus',
        description: 'Tour-level performance with exceptional distance and control.',
        construction: '4-piece',
        coverMaterial: 'Cast Urethane',
        layers: 4,
        compression: 95,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 34.95,
        msrp: 34.95,
        availableColors: ['White', 'Yellow', 'Neon', 'Graphic'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.vicegolf.com/pro-plus',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Tour',
        manufacturer: 'Vice',
        modelYear: 2024,
        slug: 'vice-tour',
        description: 'Premium 3-piece ball offering tour performance at value pricing.',
        construction: '3-piece',
        coverMaterial: 'Cast Urethane',
        layers: 3,
        compression: 80,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 29.95,
        msrp: 29.95,
        availableColors: ['White', 'Yellow', 'Neon', 'Graphic'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.vicegolf.com/tour',
        productUrls: [],
      },
    }),

    // CUT GOLF
    prisma.ball.create({
      data: {
        name: 'Blue',
        manufacturer: 'Cut',
        modelYear: 2024,
        slug: 'cut-blue',
        description: 'Premium urethane ball with exceptional value and performance.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 85,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.cutgolf.com/blue',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'Grey',
        manufacturer: 'Cut',
        modelYear: 2024,
        slug: 'cut-grey',
        description: 'Mid-compression ball designed for moderate swing speeds.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate'],
        pricePerDozen: 24.99,
        msrp: 24.99,
        availableColors: ['White'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 3,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.cutgolf.com/grey',
        productUrls: [],
      },
    }),

    // SNELL
    prisma.ball.create({
      data: {
        name: 'MTB-X',
        manufacturer: 'Snell',
        modelYear: 2024,
        slug: 'snell-mtb-x',
        description: 'Tour-caliber performance designed for better players.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.MEDIUM,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 31.99,
        msrp: 31.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.snellgolf.com/mtb-x',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'MTB Black',
        manufacturer: 'Snell',
        modelYear: 2024,
        slug: 'snell-mtb-black',
        description: 'Softer feel with excellent greenside spin and control.',
        construction: '3-piece',
        coverMaterial: 'Urethane',
        layers: 3,
        compression: 75,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.MID,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Intermediate', 'Advanced'],
        pricePerDozen: 31.99,
        msrp: 31.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.snellgolf.com/mtb-black',
        productUrls: [],
      },
    }),

    // WILSON
    prisma.ball.create({
      data: {
        name: 'Duo Soft+',
        manufacturer: 'Wilson',
        modelYear: 2024,
        slug: 'wilson-duo-soft-plus',
        description: 'Ultra-soft feel with enhanced greenside control.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 35,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.MID,
        launchProfile: LaunchLevel.HIGH,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 19.99,
        msrp: 19.99,
        availableColors: ['White', 'Yellow', 'Orange'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.wilson.com/duo-soft-plus',
        productUrls: [],
      },
    }),

    // MAXFLI
    prisma.ball.create({
      data: {
        name: 'Tour X',
        manufacturer: 'Maxfli',
        modelYear: 2024,
        slug: 'maxfli-tour-x',
        description: 'Tour-level performance with exceptional value.',
        construction: '4-piece',
        coverMaterial: 'Urethane',
        layers: 4,
        compression: 90,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.HIGH,
        wedgeSpin: SpinLevel.HIGH,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.SOFT,
        durability: 4,
        skillLevel: ['Advanced', 'Tour'],
        pricePerDozen: 34.99,
        msrp: 34.99,
        availableColors: ['White', 'Yellow'],
        inStock: true,
        optimalTemp: TempLevel.ALL,
        coldSuitability: 4,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.maxfligolf.com/tour-x',
        productUrls: [],
      },
    }),

    prisma.ball.create({
      data: {
        name: 'SoftFli',
        manufacturer: 'Maxfli',
        modelYear: 2024,
        slug: 'maxfli-softfli',
        description: 'Incredibly soft feel with straight ball flight.',
        construction: '2-piece',
        coverMaterial: 'Ionomer',
        layers: 2,
        compression: 40,
        driverSpin: SpinLevel.LOW,
        ironSpin: SpinLevel.LOW,
        wedgeSpin: SpinLevel.LOW,
        launchProfile: LaunchLevel.MID,
        feelRating: FeelLevel.VERY_SOFT,
        durability: 5,
        skillLevel: ['Beginner', 'Intermediate'],
        pricePerDozen: 17.99,
        msrp: 17.99,
        availableColors: ['White', 'Matte'],
        inStock: true,
        optimalTemp: TempLevel.WARM,
        coldSuitability: 2,
        imageUrl: null,
        imageUrls: [],
        manufacturerUrl: 'https://www.maxfligolf.com/softfli',
        productUrls: [],
      },
    }),
  ]);

  console.log(`✅ Created ${balls.length} golf balls`);

  // ========================================
  // SEED TEST USERS
  // ========================================

  console.log('👤 Creating test users...');

  const testUser1 = await prisma.user.create({
    data: {
      email: 'test@fitmyball.com',
      name: 'Test User',
      passwordHash: await bcrypt.hash('password123', 12),
      handicap: 15.0,  // Float, not string
      homeCourseName: 'Pebble Beach',
      homeLocation: 'Monterey, CA',
      emailVerified: new Date(),
    },
  });

  const testUser2 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Golfer',
      passwordHash: await bcrypt.hash('password123', 12),
      handicap: 8.0,  // Float, not string
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created 2 test users');

  // ========================================
  // SEED USER PROFILES
  // ========================================

  console.log('📋 Creating user profiles...');

  await prisma.userProfile.create({
    data: {
      userId: testUser1.id,
      profileName: 'Summer Setup',
      isDefault: true,
      preferredFeel: 'soft',
      budgetRange: 'premium',
      colorPreference: 'white_only',
      typicalTemp: 'warm',
      driverBallSpeed: 155,
      ironDistance8: 150,
    },
  });

  await prisma.userProfile.create({
    data: {
      userId: testUser1.id,
      profileName: 'Winter Setup',
      isDefault: false,
      preferredFeel: 'medium_firm',
      budgetRange: 'value',
      colorPreference: 'open_to_color',
      typicalTemp: 'cold',
      driverBallSpeed: 150,
      ironDistance8: 145,
    },
  });

  console.log('✅ Created user profiles');

  // ========================================
  // SEED USER BALL INTERACTIONS
  // ========================================

  console.log('⭐ Creating user favorites and tried balls...');

  // Favorites
  await prisma.userFavoriteBall.createMany({
    data: [
      { userId: testUser1.id, ballId: balls[0].id }, // Pro V1
      { userId: testUser1.id, ballId: balls[5].id }, // Chrome Soft
      { userId: testUser1.id, ballId: balls[15].id }, // Z-Star
    ],
  });

  // Tried balls with reviews
  await prisma.userTriedBall.createMany({
    data: [
      {
        userId: testUser1.id,
        ballId: balls[0].id, // Pro V1
        rating: 5,
        notes: 'Excellent all-around ball. Great feel and spin control.',
        roundsPlayed: 12,
        wouldRecommend: true,
        distanceVsExpected: ComparisonLevel.AS_EXPECTED,
        spinVsExpected: SpinComparison.AS_EXPECTED,
        feelVsExpected: FeelComparison.AS_EXPECTED,
      },
      {
        userId: testUser1.id,
        ballId: balls[7].id, // Supersoft
        rating: 3,
        notes: 'Too soft for my swing speed. Not enough spin around greens.',
        roundsPlayed: 3,
        wouldRecommend: false,
        distanceVsExpected: ComparisonLevel.AS_EXPECTED,
        spinVsExpected: SpinComparison.LESS,
        feelVsExpected: FeelComparison.SOFTER,
      },
    ],
  });

  console.log('✅ Created user interactions');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
