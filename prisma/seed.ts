import { PrismaClient, SpinLevel, LaunchLevel, FeelLevel, TempLevel, ComparisonLevel, SpinComparison, FeelComparison } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function spin(val: string): SpinLevel {
  switch (val) {
    case 'Low': return SpinLevel.LOW;
    case 'Low-Mid': return SpinLevel.LOW_MID;
    case 'Mid': return SpinLevel.MID;
    case 'Mid-High': return SpinLevel.MID_HIGH;
    case 'High': return SpinLevel.HIGH;
    default: throw new Error(`Unknown spin level: ${val}`);
  }
}

function launch(val: string): LaunchLevel {
  switch (val) {
    case 'Low': return LaunchLevel.LOW;
    case 'Low-Mid': return LaunchLevel.LOW_MID;
    case 'Mid': return LaunchLevel.MID;
    case 'Mid-High': return LaunchLevel.MID_HIGH;
    case 'High': return LaunchLevel.HIGH;
    default: throw new Error(`Unknown launch level: ${val}`);
  }
}

function feel(val: string): FeelLevel {
  switch (val) {
    case 'Very Soft': return FeelLevel.VERY_SOFT;
    case 'Soft': return FeelLevel.SOFT;
    case 'Medium': return FeelLevel.MEDIUM;
    case 'Firm': return FeelLevel.FIRM;
    default: throw new Error(`Unknown feel level: ${val}`);
  }
}

function temp(val: string): TempLevel {
  switch (val) {
    case 'Warm': return TempLevel.WARM;
    case 'Moderate': return TempLevel.MODERATE;
    case 'Cold': return TempLevel.COLD;
    case 'All': return TempLevel.ALL;
    default: return TempLevel.ALL;
  }
}

// Normalize cover material to schema-accepted values
function cover(val: string): string {
  if (val.includes('Cast Urethane')) return 'Cast Urethane';
  if (val.includes('Urethane')) return 'Urethane';
  if (val.includes('Ionomer')) return 'Ionomer';
  if (val.includes('Surlyn')) return 'Surlyn';
  return val;
}

// Parse handicap range string to min/max
function handicapRange(val: string): { targetHandicapMin: number; targetHandicapMax: number } {
  if (val === '20+') return { targetHandicapMin: 20, targetHandicapMax: 36 };
  if (val === '15+') return { targetHandicapMin: 15, targetHandicapMax: 36 };
  if (val === '10+') return { targetHandicapMin: 10, targetHandicapMax: 36 };
  const match = val.match(/(\d+)-(\d+)/);
  if (match) return { targetHandicapMin: parseInt(match[1]), targetHandicapMax: parseInt(match[2]) };
  return { targetHandicapMin: 0, targetHandicapMax: 36 };
}

// Derive skill level from handicap range
function skillLevel(handicapStr: string): string[] {
  if (handicapStr === '20+') return ['Beginner'];
  if (handicapStr === '15+') return ['Beginner', 'Intermediate'];
  if (handicapStr.startsWith('10')) return ['Intermediate'];
  if (handicapStr.startsWith('5-')) return ['Intermediate', 'Advanced'];
  if (handicapStr.startsWith('0-5')) return ['Tour', 'Advanced'];
  if (handicapStr.startsWith('0-10')) return ['Tour', 'Advanced'];
  if (handicapStr.startsWith('0-15')) return ['Advanced'];
  return ['Intermediate', 'Advanced'];
}

function slug(manufacturer: string, name: string): string {
  return `${manufacturer}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🌱 Seeding database...');

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

  console.log('⛳ Creating golf balls...');

  const ballData = [
    // [0] Titleist Pro V1
    { manufacturer: 'Titleist', ball_name: 'Pro V1', construction: '3-piece', cover_material: 'Cast Urethane', compression_rating: 90, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'The #1 ball on Tour offering exceptional distance, control and short game spin.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/pro-v1' }] },
    // [1] Titleist Pro V1x
    { manufacturer: 'Titleist', ball_name: 'Pro V1x', construction: '4-piece', cover_material: 'Cast Urethane', compression_rating: 100, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid-High', wedge_spin: 'High' }, launch_characteristics: 'Low-Mid', feel_rating: 'Firm', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'High flight with low spin for distance and control.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/pro-v1x' }] },
    // [2] Titleist Pro V1x Left Dash
    { manufacturer: 'Titleist', ball_name: 'Pro V1x Left Dash', construction: '4-piece', cover_material: 'Cast Urethane', compression_rating: 105, spin_profile: { driver_spin: 'Low-Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low', feel_rating: 'Firm', price_per_dozen_msrp: 54.99, available_colors: ['White'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Firmest feel with lowest spin for maximum distance.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/pro-v1x-left-dash' }] },
    // [3] Titleist AVX
    { manufacturer: 'Titleist', ball_name: 'AVX', construction: '3-piece', cover_material: 'Cast Urethane', compression_rating: 80, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Very Soft', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-15', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Low compression for soft feel and distance.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/avx' }] },
    // [4] Titleist Tour Soft
    { manufacturer: 'Titleist', ball_name: 'Tour Soft', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 65, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'Mid' }, launch_characteristics: 'Mid', feel_rating: 'Very Soft', price_per_dozen_msrp: 39.99, available_colors: ['White', 'Yellow', 'Green'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Soft feel with great distance for mid handicaps.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/tour-soft' }] },
    // [5] Titleist Velocity
    { manufacturer: 'Titleist', ball_name: 'Velocity', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 85, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low' }, launch_characteristics: 'High', feel_rating: 'Firm', price_per_dozen_msrp: 34.99, available_colors: ['White', 'Yellow', 'Orange', 'Pink'], target_handicap_range: '20+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Maximum distance with high launch.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/velocity' }] },
    // [6] Titleist TruFeel
    { manufacturer: 'Titleist', ball_name: 'TruFeel', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 65, spin_profile: { driver_spin: 'Low', iron_spin: 'Low-Mid', wedge_spin: 'Mid' }, launch_characteristics: 'Mid', feel_rating: 'Very Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '15+', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Ultra-soft feel with long distance and consistent short-game performance.', product_page_urls: [{ retailer: 'Titleist', url: 'https://www.titleist.com/golf-balls/trufeel' }] },
    // [7] Callaway Chrome Tour X
    { manufacturer: 'Callaway', ball_name: 'Chrome Tour X', construction: '4-piece', cover_material: 'Urethane', compression_rating: 111, spin_profile: { driver_spin: 'Mid-High', iron_spin: 'High', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Firm', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Highest spin and control for tour-level performance.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/chrome-tour-x-2026' }] },
    // [8] Callaway Chrome Tour
    { manufacturer: 'Callaway', ball_name: 'Chrome Tour', construction: '4-piece', cover_material: 'Urethane', compression_rating: 95, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-15', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Balanced distance and control.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/chrome-tour-2026' }] },
    // [9] Callaway Chrome Tour Triple Diamond
    { manufacturer: 'Callaway', ball_name: 'Chrome Tour Triple Diamond', construction: '4-piece', cover_material: 'Urethane', compression_rating: 105, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low', feel_rating: 'Firm', price_per_dozen_msrp: 54.99, available_colors: ['White'], target_handicap_range: '0-5', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Low spin distance for fast swingers.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/chrome-tour-triple-diamond' }] },
    // [10] Callaway Chrome Soft
    { manufacturer: 'Callaway', ball_name: 'Chrome Soft', construction: '4-piece', cover_material: 'Urethane', compression_rating: 75, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid-High', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Very Soft', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '5-15', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Soft feel with excellent greenside control.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/chrome-soft' }] },
    // [11] Callaway Supersoft
    { manufacturer: 'Callaway', ball_name: 'Supersoft', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 40, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low-Mid' }, launch_characteristics: 'High', feel_rating: 'Very Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow', 'Orange', 'Pink', 'Red'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Ultra soft for maximum feel and distance.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/supersoft' }] },
    // [12] Callaway ERC Soft
    { manufacturer: 'Callaway', ball_name: 'ERC Soft', construction: '3-piece', cover_material: 'Ionomer', compression_rating: 65, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'Mid' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 44.99, available_colors: ['White'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Distance with soft feel.', product_page_urls: [{ retailer: 'Callaway', url: 'https://www.callawaygolf.com/erc-soft' }] },
    // [13] TaylorMade TP5
    { manufacturer: 'TaylorMade', ball_name: 'TP5', construction: '5-piece', cover_material: 'Cast Urethane', compression_rating: 85, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid-High', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Tour performance with high spin.', product_page_urls: [{ retailer: 'TaylorMade', url: 'https://www.taylormadegolf.com/tp5' }] },
    // [14] TaylorMade TP5x
    { manufacturer: 'TaylorMade', ball_name: 'TP5x', construction: '5-piece', cover_material: 'Cast Urethane', compression_rating: 97, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low-Mid', feel_rating: 'Firm', price_per_dozen_msrp: 54.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Low spin distance for fast players.', product_page_urls: [{ retailer: 'TaylorMade', url: 'https://www.taylormadegolf.com/tp5x' }] },
    // [15] TaylorMade Tour Response
    { manufacturer: 'TaylorMade', ball_name: 'Tour Response', construction: '3-piece', cover_material: 'Urethane', compression_rating: 70, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'Mid-High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 44.99, available_colors: ['White'], target_handicap_range: '5-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Soft urethane for better players on budget.', product_page_urls: [{ retailer: 'TaylorMade', url: 'https://www.taylormadegolf.com/tour-response' }] },
    // [16] TaylorMade Speed Soft
    { manufacturer: 'TaylorMade', ball_name: 'Speed Soft', construction: '3-piece', cover_material: 'Ionomer', compression_rating: 55, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low' }, launch_characteristics: 'High', feel_rating: 'Very Soft', price_per_dozen_msrp: 29.99, available_colors: ['White'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Soft feel distance ball.', product_page_urls: [{ retailer: 'TaylorMade', url: 'https://www.taylormadegolf.com/speed-soft' }] },
    // [17] TaylorMade Distance+
    { manufacturer: 'TaylorMade', ball_name: 'Distance+', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 77, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Mid' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'High-velocity distance with soft feel and alignment aid option.', product_page_urls: [{ retailer: 'TaylorMade', url: 'https://www.taylormadegolf.com/Distance+-Golf-Balls' }] },
    // [18] Bridgestone TOUR B X
    { manufacturer: 'Bridgestone', ball_name: 'TOUR B X', construction: '3-piece', cover_material: 'Urethane', compression_rating: 99, spin_profile: { driver_spin: 'Mid-High', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low', feel_rating: 'Firm', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Distance with tour spin.', product_page_urls: [{ retailer: 'Bridgestone', url: 'https://www.bridgestonegolf.com/tour-b-x' }] },
    // [19] Bridgestone TOUR B XS
    { manufacturer: 'Bridgestone', ball_name: 'TOUR B XS', construction: '3-piece', cover_material: 'Urethane', compression_rating: 99, spin_profile: { driver_spin: 'High', iron_spin: 'High', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Maximum spin for control.', product_page_urls: [{ retailer: 'Bridgestone', url: 'https://www.bridgestonegolf.com/tour-b-xs' }] },
    // [20] Bridgestone TOUR B RX
    { manufacturer: 'Bridgestone', ball_name: 'TOUR B RX', construction: '3-piece', cover_material: 'Urethane', compression_rating: 85, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Softer feel for moderate speeds.', product_page_urls: [{ retailer: 'Bridgestone', url: 'https://www.bridgestonegolf.com/tour-b-rx' }] },
    // [21] Bridgestone TOUR B RXS
    { manufacturer: 'Bridgestone', ball_name: 'TOUR B RXS', construction: '3-piece', cover_material: 'Urethane', compression_rating: 85, spin_profile: { driver_spin: 'Low-Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Spin control for slicers.', product_page_urls: [{ retailer: 'Bridgestone', url: 'https://www.bridgestonegolf.com/tour-b-rxs' }] },
    // [22] Bridgestone e12 Speed
    { manufacturer: 'Bridgestone', ball_name: 'e12 Speed', construction: '2-piece', cover_material: 'Surlyn', compression_rating: 75, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low-Mid' }, launch_characteristics: 'Mid', feel_rating: 'Medium', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Best-value distance ball with maximum speed and penetrating flight (2026 robot test winner).', product_page_urls: [{ retailer: 'Bridgestone', url: 'https://www.bridgestonegolf.com/e12-speed' }] },
    // [23] Srixon Z-STAR
    { manufacturer: 'Srixon', ball_name: 'Z-STAR', construction: '3-piece', cover_material: 'Urethane', compression_rating: 92, spin_profile: { driver_spin: 'High', iron_spin: 'High', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-15', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Tour performance with soft feel.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/z-star' }] },
    // [24] Srixon Z-STAR XV
    { manufacturer: 'Srixon', ball_name: 'Z-STAR XV', construction: '4-piece', cover_material: 'Urethane', compression_rating: 112, spin_profile: { driver_spin: 'Mid-High', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Firm', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Distance with spin.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/z-star-xv' }] },
    // [25] Srixon Z-STAR Diamond
    { manufacturer: 'Srixon', ball_name: 'Z-STAR Diamond', construction: '3-piece', cover_material: 'Urethane', compression_rating: 106, spin_profile: { driver_spin: 'High', iron_spin: 'High', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'High spin all around.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/z-star-diamond' }] },
    // [26] Srixon Q-STAR Tour
    { manufacturer: 'Srixon', ball_name: 'Q-STAR Tour', construction: '3-piece', cover_material: 'Urethane', compression_rating: 74, spin_profile: { driver_spin: 'Low-Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 34.99, available_colors: ['White', 'Yellow'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Tour-level spin and soft feel at outstanding value.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/q-star-tour' }] },
    // [27] Srixon Q-STAR ULTISPEED
    { manufacturer: 'Srixon', ball_name: 'Q-STAR ULTISPEED', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 75, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 29.99, available_colors: ['White'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Distance ionomer ball.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/q-star-ultispeed' }] },
    // [28] Srixon Soft Feel
    { manufacturer: 'Srixon', ball_name: 'Soft Feel', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 60, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low-Mid' }, launch_characteristics: 'High', feel_rating: 'Very Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '20+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Softest distance ball.', product_page_urls: [{ retailer: 'Srixon', url: 'https://www.srixon.com/us/soft-feel' }] },
    // [29] Wilson Staff Model
    { manufacturer: 'Wilson', ball_name: 'Staff Model', construction: '4-piece', cover_material: 'Urethane', compression_rating: 100, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Medium', price_per_dozen_msrp: 49.99, available_colors: ['White'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Tour level performance.', product_page_urls: [{ retailer: 'Wilson', url: 'https://www.wilson.com/en-us/golf/balls/staff-model' }] },
    // [30] Wilson Staff Model X
    { manufacturer: 'Wilson', ball_name: 'Staff Model X', construction: '4-piece', cover_material: 'Urethane', compression_rating: 114, spin_profile: { driver_spin: 'Mid-High', iron_spin: 'High', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Firm', price_per_dozen_msrp: 49.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-5', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'High spin tour ball.', product_page_urls: [{ retailer: 'Wilson', url: 'https://www.wilson.com/en-us/golf/balls/staff-model-x' }] },
    // [31] Wilson Triad
    { manufacturer: 'Wilson', ball_name: 'Triad', construction: '3-piece', cover_material: 'Urethane', compression_rating: 80, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'Mid-High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 44.99, available_colors: ['White'], target_handicap_range: '5-15', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Balanced performance.', product_page_urls: [{ retailer: 'Wilson', url: 'https://www.wilson.com/en-us/golf/balls/triad' }] },
    // [32] Wilson Duo Soft
    { manufacturer: 'Wilson', ball_name: 'Duo Soft', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 35, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low' }, launch_characteristics: 'High', feel_rating: 'Very Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '20+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Softest 2-piece ball.', product_page_urls: [{ retailer: 'Wilson', url: 'https://www.wilson.com/en-us/golf/balls/duo-soft' }] },
    // [33] Maxfli Tour X
    { manufacturer: 'Maxfli', ball_name: 'Tour X', construction: '4-piece', cover_material: 'Cast Urethane', compression_rating: 117, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low-Mid', feel_rating: 'Firm', price_per_dozen_msrp: 39.99, available_colors: ['White', 'Yellow'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Tour level value.', product_page_urls: [{ retailer: 'Maxfli', url: 'https://www.maxfli.com/tour-x' }] },
    // [34] Maxfli Tour
    { manufacturer: 'Maxfli', ball_name: 'Tour', construction: '3-piece', cover_material: 'Urethane', compression_rating: 90, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 39.99, available_colors: ['White'], target_handicap_range: '5-15', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Great all-around performer.', product_page_urls: [{ retailer: 'Maxfli', url: 'https://www.maxfli.com/tour' }] },
    // [35] Vice Pro Plus
    { manufacturer: 'Vice', ball_name: 'Pro Plus', construction: '4-piece', cover_material: 'Cast Urethane', compression_rating: 116, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid-High', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Medium', price_per_dozen_msrp: 34.99, available_colors: ['White', 'Lime'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Premium DTC performance.', product_page_urls: [{ retailer: 'Vice', url: 'https://www.vicegolf.com/pro-plus' }] },
    // [36] Vice Pro
    { manufacturer: 'Vice', ball_name: 'Pro', construction: '3-piece', cover_material: 'Urethane', compression_rating: 95, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid-High', feel_rating: 'Soft', price_per_dozen_msrp: 34.99, available_colors: ['White'], target_handicap_range: '5-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Versatile tour ball.', product_page_urls: [{ retailer: 'Vice', url: 'https://www.vicegolf.com/pro' }] },
    // [37] Vice Pro Air
    { manufacturer: 'Vice', ball_name: 'Pro Air', construction: '3-piece', cover_material: 'Urethane', compression_rating: 65, spin_profile: { driver_spin: 'Low', iron_spin: 'Low-Mid', wedge_spin: 'Mid' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 34.99, available_colors: ['White'], target_handicap_range: '15+', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Soft feel for slower swings.', product_page_urls: [{ retailer: 'Vice', url: 'https://www.vicegolf.com/pro-air' }] },
    // [38] Kirkland Performance+ V3.0
    { manufacturer: 'Kirkland Signature', ball_name: 'Performance+ V3.0', construction: '3-piece', cover_material: 'Urethane', compression_rating: 107, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 24.99, available_colors: ['White'], target_handicap_range: '5-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Excellent value urethane ball.', product_page_urls: [{ retailer: 'Costco', url: 'https://www.costco.com/kirkland-signature-performance-golf-balls' }] },
    // [39] Mizuno Pro S
    { manufacturer: 'Mizuno', ball_name: 'Pro S', construction: '3-piece', cover_material: 'Urethane', compression_rating: 95, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Low', feel_rating: 'Firm', price_per_dozen_msrp: 49.99, available_colors: ['White'], target_handicap_range: '0-10', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 3 }, marketing_description: 'Low spin firm tour ball.', product_page_urls: [{ retailer: 'Mizuno', url: 'https://www.mizunogolf.com/us/en-us/golf-balls/pro-s' }] },
    // [40] PXG Xtreme Tour
    { manufacturer: 'PXG', ball_name: 'Xtreme Tour', construction: '4-piece', cover_material: 'Urethane', compression_rating: 95, spin_profile: { driver_spin: 'Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'High', feel_rating: 'Medium', price_per_dozen_msrp: 49.99, available_colors: ['White'], target_handicap_range: '0-15', durability_rating: 3, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Premium performance.', product_page_urls: [{ retailer: 'PXG', url: 'https://www.pxg.com/xtreme-tour' }] },
    // [41] Pinnacle Rush
    { manufacturer: 'Pinnacle', ball_name: 'Rush', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 80, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low' }, launch_characteristics: 'High', feel_rating: 'Firm', price_per_dozen_msrp: 19.99, available_colors: ['White'], target_handicap_range: '20+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Maximum distance value ball.', product_page_urls: [{ retailer: 'Pinnacle', url: 'https://www.pinnaclegolf.com/rush' }] },
    // [42] Snell Get Sum
    { manufacturer: 'Snell', ball_name: 'Get Sum', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 68, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Mid' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 24.99, available_colors: ['White', 'Yellow'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Long distance value ball with soft feel and extreme durability.', product_page_urls: [{ retailer: 'Snell', url: 'https://www.snellgolf.com/products/get-sum' }] },
    // [43] Snell Prime 3.0
    { manufacturer: 'Snell', ball_name: 'Prime 3.0', construction: '3-piece', cover_material: 'Cast Urethane', compression_rating: 82, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid-High', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 34.99, available_colors: ['White', 'Yellow'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Total performance with low driver spin, mid-high iron spin, and soft feel for mid-swing speeds.', product_page_urls: [{ retailer: 'Snell', url: 'https://www.snellgolf.com/products/prime-3-0-golf-ball' }] },
    // [44] Cut Red
    { manufacturer: 'Cut', ball_name: 'Red', construction: '2-piece', cover_material: 'Ionomer', compression_rating: 60, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low-Mid' }, launch_characteristics: 'High', feel_rating: 'Soft', price_per_dozen_msrp: 16.00, available_colors: ['White'], target_handicap_range: '15+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Ultra-affordable long-distance 2-piece ball with soft feel for beginners and high handicappers.', product_page_urls: [{ retailer: 'Cut', url: 'https://www.cutgolf.co/products/cut-red' }] },
    // [45] Cut Grey
    { manufacturer: 'Cut', ball_name: 'Grey', construction: '3-piece', cover_material: 'Urethane', compression_rating: 80, spin_profile: { driver_spin: 'Low', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Very Soft', price_per_dozen_msrp: 24.95, available_colors: ['Grey'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Affordable 3-piece urethane ball with butter-soft feel and excellent greenside spin.', product_page_urls: [{ retailer: 'Cut', url: 'https://www.cutgolf.co/products/cut-grey' }] },
    // [46] OnCore AVANT 55
    { manufacturer: 'OnCore', ball_name: 'AVANT 55', construction: '2-piece', cover_material: 'Surlyn', compression_rating: 55, spin_profile: { driver_spin: 'Low', iron_spin: 'Low', wedge_spin: 'Low-Mid' }, launch_characteristics: 'High', feel_rating: 'Very Soft', price_per_dozen_msrp: 19.99, available_colors: ['White', 'Yellow', 'Matte Green'], target_handicap_range: '20+', durability_rating: 5, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 5 }, marketing_description: 'Award-winning super-soft distance ball perfect for slower swings and cold weather.', product_page_urls: [{ retailer: 'OnCore', url: 'https://www.oncoregolf.com/products/avant-55' }] },
    // [47] OnCore ELIXR
    { manufacturer: 'OnCore', ball_name: 'ELIXR', construction: '3-piece', cover_material: 'Urethane', compression_rating: 84, spin_profile: { driver_spin: 'Low-Mid', iron_spin: 'Mid', wedge_spin: 'High' }, launch_characteristics: 'Mid', feel_rating: 'Soft', price_per_dozen_msrp: 29.99, available_colors: ['White', 'Yellow', 'Matte'], target_handicap_range: '10-20', durability_rating: 4, temperature_performance: { optimal_range: 'All', cold_weather_suitability: 4 }, marketing_description: 'Great-value 3-piece urethane ball with balanced distance, accuracy, and greenside control.', product_page_urls: [{ retailer: 'OnCore', url: 'https://www.oncoregolf.com/products/elixr' }] },
  ];

  const balls = await Promise.all(
    ballData.map((b) => {
      const hc = handicapRange(b.target_handicap_range);
      return prisma.ball.create({
        data: {
          name: b.ball_name,
          manufacturer: b.manufacturer,
          modelYear: 2024,
          slug: slug(b.manufacturer, b.ball_name),
          description: b.marketing_description,
          construction: b.construction,
          coverMaterial: cover(b.cover_material),
          layers: parseInt(b.construction.charAt(0)),
          compression: b.compression_rating,
          driverSpin: spin(b.spin_profile.driver_spin),
          ironSpin: spin(b.spin_profile.iron_spin),
          wedgeSpin: spin(b.spin_profile.wedge_spin),
          launchProfile: launch(b.launch_characteristics),
          feelRating: feel(b.feel_rating),
          durability: b.durability_rating,
          targetHandicapMin: hc.targetHandicapMin,
          targetHandicapMax: hc.targetHandicapMax,
          skillLevel: skillLevel(b.target_handicap_range),
          pricePerDozen: b.price_per_dozen_msrp,
          msrp: b.price_per_dozen_msrp,
          availableColors: b.available_colors,
          inStock: true,
          discontinued: false,
          optimalTemp: temp(b.temperature_performance.optimal_range),
          coldSuitability: b.temperature_performance.cold_weather_suitability,
          imageUrl: null,
          imageUrls: [],
          productUrls: b.product_page_urls.map((p) => ({ ...p, isAffiliate: false })),
        },
      });
    })
  );

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
      handicap: 15.0,
      homeCourseName: 'Pebble Beach',
      homeLocation: 'Monterey, CA',
      emailVerified: new Date(),
    },
  });

  await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Golfer',
      passwordHash: await bcrypt.hash('password123', 12),
      handicap: 8.0,
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

  // balls[0]=Pro V1, balls[10]=Chrome Soft, balls[23]=Z-STAR
  await prisma.userFavoriteBall.createMany({
    data: [
      { userId: testUser1.id, ballId: balls[0].id },  // Pro V1
      { userId: testUser1.id, ballId: balls[10].id }, // Chrome Soft
      { userId: testUser1.id, ballId: balls[23].id }, // Z-STAR
    ],
  });

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
        ballId: balls[11].id, // Supersoft
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
