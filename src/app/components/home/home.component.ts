import { Component, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/interfaces/category';
import { Product } from 'src/app/shared/interfaces/product';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { EcommerceDataService } from 'src/app/shared/services/ecommerce-data.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private _EcommerceDataService: EcommerceDataService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _WishlistService: WishlistService,
    private _NgxSpinnerService: NgxSpinnerService,
    private _AuthService: AuthService
  ) {}
  // properties
  search: string = '';
  allProducts: Product[] = [];
  allGategories: Category[] = [];
  productsInwishlist: Product[] = [];
  // main carousal options
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navText: ['', ''],
    dots: true,
    navSpeed: 500,
    autoplay: true,
    items: 1,
    nav: false,
  };
  // categories carousal options
  CategoriesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navText: ['', ''],
    dots: false,
    navSpeed: 500,
    autoplay: true,
    responsive: {
      0: {
        items: 2,
      },
      576: {
        items: 3,
      },
      768: {
        items: 4,
      },
      992: {
        items: 5,
      },
    },
    nav: true,
  };
  // for unsubscribe
  getProductsSub!: Subscription;
  getGategoriesSub!: Subscription;
  addToCartSub!: Subscription;
  addToWishlistSub!: Subscription;

  ngOnInit(): void {
    this.getGategories();
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

  getGategories(): void {
    this._NgxSpinnerService.show();
    this.getProductsSub = this._EcommerceDataService.getCategories().subscribe({
      next: (response: any) => {
        this.allGategories = response.data;
        this._NgxSpinnerService.hide();
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

  isInWishlist(id: string): boolean {
    for (let item of this.productsInwishlist) {
      if (item.id == id) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.getProductsSub?.unsubscribe();
    this.getGategoriesSub?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
  }
}
