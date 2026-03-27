import { Component, OnInit, inject } from '@angular/core';
import { UserDataService } from '../../core/services/user-data.service';

@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css'
})
export class TutorialsComponent implements OnInit {
  private userDataService = inject(UserDataService);
  tutorialsData: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.userDataService.getUserTutorials().subscribe({
      next: (res: any) => {
        this.tutorialsData = res.tutorials || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load tutorials or you not have purchased any tutorials yet.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
