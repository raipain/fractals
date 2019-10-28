import { trigger, style, transition, animate, group } from '@angular/animations';

export const SliderAnimation = [
    trigger('intro', [
        transition(':enter', [
          style({transform: 'translateX(100%)'}),
          animate(350)
        ]),
        transition(':leave', [
          group([
            animate('0.2s ease', style({
              transform: 'translateX(100%)'
            })),
            animate('0.5s 0.2s ease', style({
              opacity: 0
            }))
          ])
        ])
      ])
    ];