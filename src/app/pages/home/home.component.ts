import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public data: { name: string; value: number }[] = [];

  public josNumber: Set<number> = new Set();
  private olympicsSubscription: Subscription | undefined;
  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicsSubscription = this.olympicService
      .getOlympics()
      .subscribe((value: Array<Olympic>) => {
        // Data preparation for the pie chart
        this.data = value.map((olympic) => ({
          name: olympic.country,
          value: this.olympicService.countMedals(olympic),
        }));
        // Calculate the number of JOs
        value.forEach((olympic) => {
          olympic.participations.forEach((participation) => {
            this.josNumber.add(participation.id);
          });
        });
      });
  }

  // Unsubscribe when component is destroyed so that it can't produce memory leaks or side effects
  ngOnDestroy(): void {
    this.olympicsSubscription?.unsubscribe();
  }

  // Navigate to the country selected from the chart
  onSelect(event: any): void {
    this.router.navigateByUrl(`/detail/${event.name}`);
  }
}
