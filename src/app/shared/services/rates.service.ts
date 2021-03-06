import {Injectable} from "@angular/core";
import {Rates} from "../models/Rates";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  userId: number = 0;

  constructor(private http: HttpClient,
              private auth: AuthService) {
    let getUserId = this.auth.getUserId();
    if (getUserId) {
      this.userId = +getUserId;
    }
  }

  getRates(): Promise<Rates> {
    return new Promise(resolve => {
      let rates = null;
      let ratesString = localStorage.getItem("rates");
      let today = new Date();
      let todayString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + ("0" + today.getDate()).slice(-2);
      if (ratesString && JSON.parse(ratesString) && JSON.parse(ratesString).date == todayString) {
        rates = JSON.parse(ratesString);
        resolve(rates);
      } else {
        this.uploadRates(todayString)
          .subscribe(
            (rates: Rates) => {
              localStorage.setItem("rates", JSON.stringify(rates));
              resolve(rates);
            });
      }
    })
  }

  uploadRates(date: string): Observable<any> {
    return this.http.post<any>('/api/currency/rates', date);
  }
}
