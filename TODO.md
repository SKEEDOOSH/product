# TODO: Add Images to Products

## Current Issue
- Product images are displayed assuming all files are .jpg, but assets folder contains mixed extensions (.jpg, .png, .webp).
- This causes broken images for non-.jpg files.

## Steps to Fix and Add Images

1. **Update Product Data (Backend)**
   - Ensure each product's `imageFile` field includes the full filename with extension (e.g., "Alaska.jpg", "alaska.png").
   - This requires updating the backend API at /api/product to return the full filename.

2. **Update HTML Template** ✅
   - Modified `src/app/product-category/product-category.component.html` to use `prod.imageFile` directly without appending .jpg.

3. **Add New Images**
   - Place new image files in `src/assets/products/`.
   - Update the corresponding product's `imageFile` in the backend data to match the new filename (with extension).

4. **Test Image Display**
   - Run the app and verify images load correctly in the product category view.

## Dependent Files
- `src/app/product-category/product-category.component.html`: Update img src.
- Backend API: Update product data to include full image filenames.

## Followup Steps
- After updating HTML, test the app.
- If adding new products, ensure images are added to assets and data is updated.
