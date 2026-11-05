import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

// how many requests are in flight right now
let pending = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  pending++;
  spinner.show(); // request goes out -> show the spinner

  // finalize runs when the request succeeds, fails, or is cancelled
  return next(req).pipe(
    finalize(() => {
      pending--;
      // hide only when the LAST request finishes, otherwise the first
      // one to complete would hide the spinner while others still run
      if (pending === 0) {
        spinner.hide();
      }
    }),
  );
};
