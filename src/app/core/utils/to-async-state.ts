import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AsyncState } from '../models/async-state';

export function toAsyncState<T>() {
  return (source$: Observable<T>): Observable<AsyncState<T, string>> =>
    source$.pipe(
      map((data): AsyncState<T, string> => AsyncState.success(data)),
      startWith(AsyncState.loading()),
      catchError((err): Observable<AsyncState<T, string>> => {
        const message = err?.error?.message ?? err?.message ?? 'An unexpected error occurred';
        return of(AsyncState.error(message));
      })
    );
}
