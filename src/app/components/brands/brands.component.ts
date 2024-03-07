import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/shared/interfaces/brand';
import { EcommerceDataService } from 'src/app/shared/services/ecommerce-data.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class BrandsComponent implements OnInit {
  constructor(
    private _EcommerceDataService: EcommerceDataService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  allBrands: Brand[] = [];
  brand: Brand = {} as Brand;
  brandDetailsReady: boolean = false;
  getSubscriotion!: Subscription;

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this._NgxSpinnerService.show();
    this.getSubscriotion = this._EcommerceDataService.getAllBrands().subscribe({
      next: (response: any) => {
        this.allBrands = response.data;
        this._NgxSpinnerService.hide();
      },
      error: (err: any) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }

  getSpecificBrand(productId: string): void {
    this._NgxSpinnerService.show();
    this._EcommerceDataService.getSpecificBrand(productId).subscribe({
      next: (response: any) => {
        this.brand = response.data;
        this._NgxSpinnerService.hide();
        this.brandDetailsReady = true;
      },
      error: (err: any) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }

  ngOnDestroy(): void {
    this.getSubscriotion?.unsubscribe();
  }
}
