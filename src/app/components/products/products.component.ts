import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { CartService } from 'src/app/shared/services/cart.service';
import { EcommerceDataService } from 'src/app/shared/services/ecommerce-data.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private _EcommerceDataService: EcommerceDataService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _WishlistService: WishlistService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  search: string = '';
  allProducts: Product[] = [];
  productsInwishlist: Product[] = [];
  // for unsubscribe
  getProductsSub!: Subscription;
  getGategoriesSub!: Subscription;
  addToCartSub!: Subscription;
  addToWishlistSub!: Subscription;

  ngOnInit(): void {
    this.getProducts();
    this.getWhatInWishlist();
  }

  getProducts(): void {
    this._NgxSpinnerService.show();
    this.getProductsSub = this._EcommerceDataService.getProducts().subscribe({
      next: (response: any) => {
        this._NgxSpinnerService.hide();
        this.allProducts = response.data;
      },
      error: (err: any) => {
        this._NgxSpinnerService.hide();
        console.log(err);
      },
    });
  }

  // cart
  addToCart(productId: string): void {
    this._NgxSpinnerService.show();
    this.addToCartSub = this._CartService
      .addProductToCart(productId)
      .subscribe({
        next: (response: any) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.success(response.message);
        },
        error: (err: any) => {
          this._NgxSpinnerService.hide();
          this._ToastrService.success(err.message);
          console.log(err);
        },
      });
  }
  // wishlist
  addToWishList(productId: string, e: any): void {
    if (!e.target.classList.contains('text-danger')) {
      this._NgxSpinnerService.show();
      this.addToWishlistSub = this._WishlistService
        .addToWishList(productId)
        .subscribe({
          next: (response: any) => {
            // update products in wishList
            this.getWhatInWishlist();
            this._NgxSpinnerService.hide();
            this._ToastrService.success(response.message);
          },
          error: (err: any) => {
            this._NgxSpinnerService.hide();
            this._ToastrService.error('Not added to wishlist');
            console.log(err);
          },
        });
    } else if (e.target.classList.contains('text-danger')) {
      this.removeProductFromWishlist(productId);
    }
  }

  isInWishlist(id: string): boolean {
    for (let item of this.productsInwishlist) {
      if (item.id == id) {
        return true;
      }
    }
    return false;
  }

  removeProductFromWishlist(productId: string): void {
    this._NgxSpinnerService.show();
    this._WishlistService.removeItem(productId).subscribe({
      next: (response) => {
        this._NgxSpinnerService.hide();
        this._ToastrService.success(
          'Product Removed Successfully From Your Cart'
        );
        // update products in wishList
        this.getWhatInWishlist();
      },
      error: (err) => {
        this._NgxSpinnerService.hide();
        console.log(err);
        this._ToastrService.success(err.message);
      },
    });
  }

  getWhatInWishlist(): void {
    this._WishlistService.getWishListItems().subscribe({
      next: (response) => {
        this.productsInwishlist = response.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.getProductsSub?.unsubscribe();
    this.getGategoriesSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
  }
}
