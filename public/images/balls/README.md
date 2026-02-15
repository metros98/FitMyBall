# Golf Ball Product Images

Place golf ball product images in this directory.

## Naming Convention
- Format: `manufacturer-model-name.webp` (lowercase, hyphenated)
- Example: `titleist-pro-v1.webp`, `callaway-chrome-soft.webp`

## Image Specifications
- Format: WebP (preferred) or PNG/JPEG
- Dimensions: 400x400px minimum (square aspect ratio)
- Background: Transparent or white
- Quality: Product photography showing the ball clearly

## Adding Images
1. Save image files to this directory
2. Update the corresponding ball record in `prisma/seed.ts`
3. Change `imageUrl: null` to `imageUrl: '/images/balls/filename.webp'`
4. Reseed the database: `pnpm prisma db seed`

## Sources for Images
- Manufacturer websites (check usage rights)
- Retailer product pages
- Stock photography sites with proper licensing
- Commission product photography
