import { Component } from '@angular/core';


@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  reloadPage(): void {
    window.location.reload();
  } 
}
