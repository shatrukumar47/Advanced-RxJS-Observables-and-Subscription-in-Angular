import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DataService } from './service/data.service';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { CardComponent } from './components/card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'my-app';
  posts: any = [];
  isError: boolean = false;
  isLoading: boolean = false;
  currentPage: number = 1;

  constructor(private dataService: DataService) {}


  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.dataService.ngOnDestroy();
  }

  handlePagination(page: number){
    this.currentPage = page;
    this.loadData();
  }

  loadData(): void{
    this.isLoading = true;
    this.dataService
      .getData(this.currentPage)
      .pipe(takeUntil(this.componentDestroyed(this)))
      .subscribe(
        (res) => {
          this.posts = res;
          this.isLoading = false;
          this.isError = false;
        },
        (err) => {
          this.isError = true;
          this.isLoading = false;
          console.log(err)
        },
        () => console.log('Data retrieval completed.')
      );
  }

  componentDestroyed(component: OnDestroy): Subject<void> {
    const onDestroy$: Subject<void> = new Subject<void>();
    const originalOnDestroy = component.ngOnDestroy;

    if (!originalOnDestroy) {
      throw new Error(`${component.constructor.name} must implement OnDestroy`);
    }

    component.ngOnDestroy = () => {
      originalOnDestroy.apply(component);
      onDestroy$.next();
      onDestroy$.complete();
    };

    return onDestroy$;
  }
}
