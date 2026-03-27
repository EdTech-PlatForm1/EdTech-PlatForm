import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  getUser() {
    return { name: 'Mahmoud Saber', email: 'rodomahmoud121@gmail.com' };
  }
}
