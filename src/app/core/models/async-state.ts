export type AsyncState<T = void, E = string> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

export const AsyncState = {
  idle: (): AsyncState<never> => ({ status: 'idle' }),
  loading: (): AsyncState<never> => ({ status: 'loading' }),
  success: <T>(data: T): AsyncState<T> => ({ status: 'success', data }),
  error: <E = string>(error: E): AsyncState<never, E> => ({ status: 'error', error }),
};
