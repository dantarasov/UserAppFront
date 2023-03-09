import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Searcher } from './searcher';
import { SearcherService } from './searcher.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./component.css',],

})
export class AppComponent implements OnInit {
  title = 'searcherapp';

  searcher: Searcher = {
    id: 0,
    name: '',
    password: '',
    email: '',
    gender: '',
    phone: '',
    searcherCode: ''
  }

  public searchers: Searcher[];
  public editSearcher: Searcher;
  public deleteSearcher: Searcher;
  public filter: Searcher;

  constructor(private searcherService: SearcherService) { }

  ngOnInit() {
    this.getSearchers();
  }

  public getSearchers(): void {
    this.searcherService.getSearchers().subscribe({
      next: (response: Searcher[]) => {
        this.searchers = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onAddSearcher(addForm: NgForm) {
    document.getElementById('add-searcher-form')?.click();
    this.searcherService.addSearcher(this.searcher).subscribe({
      next: (response: Searcher) => {
        this.getSearchers();
        addForm.reset();;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  public onUpdateSearcher(searcher: Searcher): void {
    this.searcherService.updateSearcher(searcher).subscribe({
      next: (response: Searcher) => {
        this.getSearchers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteSearcher(searcherId: number): void {
    this.searcherService.deleteSearcher(searcherId).subscribe({
      next: (response: void) => {
        this.getSearchers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public findSearchers(key: string): void {
    console.log(key)
    const results: Searcher[] = [];
    for (const searcher of this.searchers) {
      if (searcher.name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(searcher);
      }
    }
    this.searchers = results;
    if (results.length === 0 || !key) {
      this.getSearchers();

    }
  }

  public onOpenModal(searcher: Searcher, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addSearcherModal');
    }
    if (mode === 'edit') {
      this.editSearcher = searcher;
      button.setAttribute('data-target', '#updateSearcherModal');
    }
    if (mode === 'delete') {
      this.deleteSearcher = searcher;
      button.setAttribute('data-target', '#deleteSearcherModal');
    }
    container?.appendChild(button);
    button.click();
  }
}
