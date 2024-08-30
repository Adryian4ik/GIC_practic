import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { sha3_512 } from 'js-sha3';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  passw: string = "";

  constructor(private router: Router, private cookieService: CookieService){

  }

  login() {
    if (sha3_512(this.passw) == "a774c44621de1237a24cc3f8558aa062b4c0e58f1ea515d0dc442b209fcff27249b5aa16fb5564d3e2ced9a7c3e89be4d9505dce95a310a6b72adece0dc78975"){
      let exp = new Date(Date.now());
      exp.setDate(exp.getDate() + 5);
      console.log(exp);
      this.cookieService.set('access', exp.getTime().toString());
      this.router.navigate(["/main"]);
    }
  }

  ngOnInit(): void {
    // checkAccess(this.router);
  }
}
