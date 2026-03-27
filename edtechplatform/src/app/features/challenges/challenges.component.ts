import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.css'
})
export class ChallengesComponent implements OnInit {
  private userDataService = inject(UserDataService);
  challengesData: any[] = [];
  isLoading = true;
  error = '';

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
