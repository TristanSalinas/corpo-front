import { Component, computed, input } from '@angular/core';
interface ColorPair {
  color: string;
  reversedColor: string;
}
@Component({
  selector: 'app-random-art',
  imports: [],
  templateUrl: './random-art.component.html',
  styleUrl: './random-art.component.css',
})
export class RandomArtComponent {
  seed = input<string>();
  size = input<string>();

  colorPair = computed((): ColorPair => this.stringToColor(this.seed()));

  //djb2 hashing algorithm. Ty gpt
  stringToColor(str: string | undefined): ColorPair {
    str = str ?? 'Bob';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + hash * 31;
    }
    let color = '#';
    let reversedColor = '#';
    for (let i = 0; i < 3; i++) {
      const value = Math.floor(hash / Math.pow(256, i)) % 256;
      const valueReversed = 255 - value;
      color += ('00' + value.toString(16)).slice(-2);
      reversedColor += ('00' + valueReversed.toString(16)).slice(-2);
    }
    return { color, reversedColor };
  }
}
