import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../model/product-category';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { CommonModule } from '@angular/common';
import { Product } from '../model/product';
import { CartItem } from '../model/cart-item';
@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  public productsCategory: ProductCategory[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getData().subscribe(data => { 
      this.productsCategory = data; 
    });
  }

  addToCart(product: Product): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user || !user.id) {
    alert('Please log in to add items to your cart.');
    return;
  }

  // Map Product → CartItem
  const cartItem: CartItem = {
    productId: product.id,
    productName: product.name,
    categoryName: product.categoryName,
    price: parseFloat(product.price),
    quantity: 1 // default to 1
  };

  this.cartService.addToCart(cartItem, user.id).subscribe({
    next: () => alert('Item added to cart!'),
    error: (err) => console.error('Error adding to cart:', err)
  });
}


}
