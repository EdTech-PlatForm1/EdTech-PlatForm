import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="users-management">
      <div class="header">
        <h2>👥 User Management</h2>
        <p>Manage application users and their roles.</p>
      </div>

      <div *ngIf="loading" class="loading">Loading user database...</div>
      <div *ngIf="error" class="alert error">{{ error }}</div>

      <div class="user-list" *ngIf="!loading && users.length > 0">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" [class.admin]="user.role === 'admin'">{{ user.role }}</span></td>
              <td>
                <button class="delete-btn" (click)="onDeleteUser(user._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  onDeleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
