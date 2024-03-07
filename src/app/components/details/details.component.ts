import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product';
import { CartService } from 'src/app/shared/services/cart.service';
import { EcommerceDataService } from 'src/app/shared/services/ecommerce-data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  constructor(
    private _EcommerceDataService: EcommerceDataService,
    private _ActivatedRoute: ActivatedRoute,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}

  // properties
  productDetails: Product = {} as Product;
  productSubscription!: Subscription;
  paramSubscription!: Subscription;
  dataIsReady: boolean = false;
  // carousal
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

  ngOnInit(): void {
    this.paramSubscription = this._ActivatedRoute.paramMap.subscribe({
      next: (params: any) => {
        let productId: any = params.get('id');
        this.getProductDetails(productId);
      },
    });
  }

  getProductDetails(productId: string) {
    this._NgxSpinnerService.show();
    this.productSubscription = this._EcommerceDataService
      .getProductDetails(productId)
      .subscribe({
        next: (response: any) => {
          this.productDetails = response.data;
          // data ready
          this.dataIsReady = true;
          this._NgxSpinnerService.hide();
        },
        error: (err: any) => {
          console.log(err);
          this._NgxSpinnerService.hide();
        },
      });
  }

  addToCart(productId: string): void {
    this._NgxSpinnerService.show();
    this._CartService.addProductToCart(productId).subscribe({
      next: (response: any) => {
        this._ToastrService.success(response.message);
        this._NgxSpinnerService.hide();
      },
      error: (err: any) => {
        this._ToastrService.success(err.message);
        this._NgxSpinnerService.hide();
      },
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
  }
}
