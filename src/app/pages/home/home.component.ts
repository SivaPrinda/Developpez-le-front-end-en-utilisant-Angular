import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public data: { name: string; value: number }[] = [];
  public josNumber: Set<string> = new Set();

  view!: [number, number];
  showLegend!: boolean;
  showLabels!: boolean;
  gradient!: boolean;
  isDoughnut!: boolean;
  colorScheme!: string;

  constructor(private olympicService: OlympicService) {}

  /*Configuration of the pie chart value*/
  chartConfig(): void {
    this.view = [700, 400];
    this.showLegend = true;
    this.showLabels = true;
    this.gradient = false;
    this.isDoughnut = false;
    this.colorScheme = 'cool';
  }

  ngOnInit(): void {
    this.chartConfig();
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((value: Array<Olympic>) => {
      //preparation for the data of the pie chart
      this.data = value.map((olympic) => ({
        name: olympic.country,
        value: this.olympicService.countMedals(olympic),
      }));
      //Calculate the number of JOs
      value.forEach((olympic) => {
        olympic.participations.forEach((participation) => {
          this.josNumber.add(participation.id);
        });
      });
    });
  }
}
