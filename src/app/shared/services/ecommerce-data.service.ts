import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EcommerceDataService {
  constructor(private _HttpClient: HttpClient) {}
  // home
  getProducts(): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products`
    );
  }
  // details
  getProductDetails(productId: string): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );
  }
  //categories and home
  getCategories(): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/categories`
    );
  }
  getSubgategory(categoryId: string): Observable<any> {
    return this._HttpClient.get(
      `https://route-ecommerce.onrender.com/api/v1/categories/${categoryId}/subcategories`
    );
  }
  // ==== brands ====
  getAllBrands(): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/brands`
    );
  }
  getSpecificBrand(brandId: string): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/brands/${brandId}`
    );
  }
}
