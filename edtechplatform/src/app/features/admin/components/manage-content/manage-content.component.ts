import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../../core/services/product.service';

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.css']
})
export class ManageContentComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  loading = false;
  activeSection: 'tutorials' | 'challenges' = 'tutorials';

  tutorialForm = { title: '', videoUrl: '', duration: 1 };
  challengeForm = { question: '', correctAnswer: '' };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.loading = true;
    this.productService.getSingleProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onAddTutorial() {
    this.productService.addTutorial(this.productId, this.tutorialForm).subscribe({
      next: () => {
        this.loadProduct();
        this.tutorialForm = { title: '', videoUrl: '', duration: 1 };
        alert('Tutorial added successfully!');
      },
      error: (err) => alert('Error adding tutorial: ' + err.message)
    });
  }

  onAddChallenge() {
    this.productService.addChallenge(this.productId, this.challengeForm).subscribe({
      next: () => {
        this.loadProduct();
        this.challengeForm = { question: '', correctAnswer: '' };
        alert('Challenge added successfully!');
      },
      error: (err) => alert('Error adding challenge: ' + err.message)
    });
  }

  onDeleteTutorial(tid: string) {
    if (confirm('Delete this tutorial?')) {
      this.productService.deleteTutorial(this.productId, tid).subscribe({
        next: () => this.loadProduct(),
        error: (err) => alert('Error deleting: ' + err.message)
      });
    }
  }

  onDeleteChallenge(cid: string) {
    if (confirm('Delete this challenge?')) {
      this.productService.deleteChallenge(this.productId, cid).subscribe({
        next: () => this.loadProduct(),
        error: (err) => alert('Error deleting: ' + err.message)
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
  }
}
