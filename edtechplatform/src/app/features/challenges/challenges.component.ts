import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent implements OnInit {
  private userDataService = inject(UserDataService);
  private productService = inject(ProductService);
  challengesData: any[] = [];
  isLoading = true;
  error = '';

  solveChallenge(productId: string, challengeId: string, answer: string) {
    this.productService.solveChallenge(productId, challengeId, answer).subscribe(res => {
      alert(res.message);
    });
  }

  ngOnInit() {
    this.userDataService.getUserChallenges().subscribe({
      next: (res: any) => {
        this.challengesData = res.challenges || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load challenges or you not have purchased any challenges yet.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
