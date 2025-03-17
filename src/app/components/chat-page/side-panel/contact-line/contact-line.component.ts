import { Component, input } from '@angular/core';
import { RandomArtComponent } from '../../../commons/random-art/random-art.component';

@Component({
  selector: 'app-contact-line',
  imports: [RandomArtComponent],
  templateUrl: './contact-line.component.html',
  styleUrl: './contact-line.component.css',
})
export class ContactLineComponent {
  name = input.required<string>();
  handleOnClick = input.required<() => void>();
}
