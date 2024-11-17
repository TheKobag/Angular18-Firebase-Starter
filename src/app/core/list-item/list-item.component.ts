import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ListItem } from './models/list-item.model';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent {
  item = input.required<ListItem>();

  onRemoveItem = output<string>();
}
