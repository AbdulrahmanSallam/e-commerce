import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private _HttpClient: HttpClient) {}

  getCartProducts(): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/cart`);
  }

  addProductToCart(productId: string): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/cart`,
      {
        productId: productId,
      }
    );
  }

  removeProduct(productId: string): Observable<any> {
    return this._HttpClient.delete(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`
    );
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(
      `https://ecommerce.routemisr.com/api/v1/cart`
    );
  }

  updateProductQuantity(productId: string, count: number): Observable<any> {
    return this._HttpClient.put(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
      { count: count }
    );
  }

  // payment
  checkoutSession(cartId: string, userInfo: object): Observable<any> {
    return this._HttpClient.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=https://github.com/AbdulrahmanSallam/e-commerce.git`,
      { shippingAddress: userInfo }
    );
  }

  getAllOrders(userId: string): Observable<any> {
    return this._HttpClient.get(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
    );
  }
}
