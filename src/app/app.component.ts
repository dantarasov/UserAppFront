import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Searcher } from './searcher';
import { SearcherService, } from './searcher.service';
import { ImageService } from './image/image.service';

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
    searcherCode: '',
    imageURL: ''
  }

  public searchers: Searcher[];
  public editSearcher: Searcher;
  public deleteSearcher: Searcher;
  public filter: Searcher;

  selectedFile: File;
  imageUrl: any;  // для отправки выбранного фото при добавлении
  editImageUrl: any; // для отправки выбранного фото при редактировании. Две разные переменные для двух разных мод.окон
  searcherImages: any[];

  constructor(private searcherService: SearcherService, private imageService: ImageService) { }

  ngOnInit() {
    this.getSearchers();
  }

  onFileSelected(event: any, mode: string) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (ev: any) => {
      if (mode === 'editInput') {
        console.log("editInput",)
        this.editSearcher.imageURL = ev.target.result;
        this.editImageUrl = this.editSearcher.imageURL;
      }
      if (mode === 'addInput') {
        console.log("addInput",)
        this.imageUrl = ev.target.result;
      }
    };
  }

  saveNewImage(searcher: Searcher, img: any) {
    this.imageService.uploadProfileImage(searcher, img.split(/,(.+)/)[1])
  }
  public getSearchers(): void {
    this.searcherService.getSearchers().subscribe({
      next: (response: Searcher[]) => {
        this.getAllImages();
        this.searchers = response;

        this.searcher = {
          id: 0,
          name: '',
          password: '',
          email: '',
          gender: '',
          phone: '',
          searcherCode: '',
          imageURL: ''
        }
        this.imageUrl = ''
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
  getAllImages() {
    this.imageService.getAllProfileImages().subscribe(images => {
      this.searcherImages = images;
      this.searchers.map((searcher) => {
        this.searcherImages.map((entry) => {
          if (searcher.id == entry.id) {
            searcher.imageURL = entry.path
            this.editSearcher = entry.path
          }
        });
      });
    });
  }

  public onAddSearcher(addForm: NgForm) {
    document.getElementById('add-searcher-form')?.click();
    this.searcherService.addSearcher(addForm.value).subscribe({
      next: (response: Searcher) => {
        this.searcher = response; // при сохранении юзера на бэке, мы получаем в ответ его id и передаем этот id в метод для сохранении аватарки
        if (this.imageUrl) {
          this.saveNewImage(this.searcher, this.imageUrl)
        }
        this.getSearchers();
        addForm.reset();
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
        this.searcher = response;
        if (this.editImageUrl) {
          this.saveNewImage(this.searcher, this.editImageUrl)
        }
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
        this.imageService.deleteImage(searcherId)
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