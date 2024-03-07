import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.css'],
})
export class AllorderComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    private _CartService: CartService,
    private _NgxSpinnerService: NgxSpinnerService
  ) {}
  // properties
  userId: string = '';
  allOrders: any[] = [];

  ngOnInit(): void {
    this.userId = this._AuthService.getUserData().id;
    console.log(this.userId);
    this.getAllOrders();
  }

  getAllOrders(): void {
    this._NgxSpinnerService.show();
    this._CartService.getAllOrders(this.userId).subscribe({
      next: (response) => {
        console.log(response);
        this.allOrders = response;
        this._NgxSpinnerService.hide();
      },
      error: (err) => {
        console.log(err);
        this._NgxSpinnerService.hide();
      },
    });
  }
}
