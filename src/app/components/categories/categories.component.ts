import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from 'src/app/category';
import { EcommerceDataService } from 'src/app/shared/services/ecommerce-data.service';
import { Subcategory } from 'src/app/subcategory';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  constructor(
    private _EcommerceDataService: EcommerceDataService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  SubcategoryReady: boolean = false;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this._NgxSpinnerService.show();
    this._EcommerceDataService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this._NgxSpinnerService.hide();
      },
      error: (err) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }
  getSubategories(categoryId: string): void {
    this._NgxSpinnerService.show();
    this._EcommerceDataService.getSubgategory(categoryId).subscribe({
      next: (response) => {
        this.subcategories = response.data;
        this.SubcategoryReady = true;
        this._NgxSpinnerService.hide();
      },
      error: (err) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }
}
