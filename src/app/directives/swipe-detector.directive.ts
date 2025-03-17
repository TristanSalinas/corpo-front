import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appSwipeDetector]',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
    '(touchend)': 'onTouchEnd()',
  },
})
export class SwipeDetectorDirective {
  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  private touchEndY = 0;

  readonly swipeRight = output();
  readonly swipeLeft = output();
  readonly swipeUp = output();
  readonly swipeDown = output();

  private readonly SWIPE_THRESHOLD = 50;

  //@HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  //@HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;
  }

  //@HostListener('touchend')
  onTouchEnd() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > this.SWIPE_THRESHOLD) {
        this.swipeRight.emit();
      } else if (deltaX < -this.SWIPE_THRESHOLD) {
        this.swipeLeft.emit();
      }
    } else {
      if (deltaY > this.SWIPE_THRESHOLD) {
        this.swipeDown.emit();
      } else if (deltaY < -this.SWIPE_THRESHOLD) {
        this.swipeUp.emit();
      }
    }
  }
}
