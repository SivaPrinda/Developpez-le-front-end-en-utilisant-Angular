import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit, OnDestroy {
  private olympicsSubscription: Subscription | undefined;
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  olympicCountry!: string;
  totalMedalCount!: number;
  totalAthleteNumber!: number;
  numberOfEntries!: number;
  graphDataChart!: any[];

  ngOnInit(): void {
    this.olympicCountry = this.route.snapshot.params['country'];
    // Data preparation for the details page
    if (this.olympicCountry) {
      this.olympicsSubscription = this.olympicService
        .getOlympicByCountry(this.olympicCountry)
        .pipe(
          map((olympic) => {
            if (olympic) {
              // Number of participations
              this.numberOfEntries = olympic.participations.length;

              // Number of medals won by the country at all games
              this.totalMedalCount = olympic.participations.reduce(
                (acc, participation) => acc + participation.medalsCount,
                0
              );

              // Number of athletes at all games
              this.totalAthleteNumber = olympic.participations.reduce(
                (acc, participation) => acc + participation.athleteCount,
                0
              );
              // Add participations to chart data in the expected structure of ngx-line-chart
              this.graphDataChart = [
                {
                  name: olympic.country,
                  series: olympic.participations.map((participation) => ({
                    name: participation.year + '',
                    value: participation.medalsCount,
                  })),
                },
              ];
            } else {
              this.router.navigateByUrl('error');
              return;
            }
          })
        )
        .subscribe();
    } else {
      this.router.navigateByUrl('error');
    }
  }

  // Unsubscribe when component is destroyed so that it can't produce memory leaks or side effects
  ngOnDestroy(): void {
    this.olympicsSubscription?.unsubscribe();
  }
}
