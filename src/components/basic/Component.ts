export default abstract class Component<State = NonNullable<unknown>> {
  readonly el: HTMLElement;

  protected state: State = {} as State;

  protected events: Record<string, (ev: Event) => void> = {} as Record<
    string,
    (ev: Event) => void
  >;

  constructor(el: HTMLElement, initialState?: Partial<State>) {
    this.el = el;

    if (initialState) {
      this.state = { ...this.state, ...initialState };
    }

    this.onMount();
  }

  setState = (patch: Partial<State>) => {
    this.state = { ...this.state, ...patch };
    this.el.innerHTML = this.render();
    this.subscribeToEvents();
  };

  subscribeToEvents() {
    for (const key in this.events) {
      if (Object.prototype.hasOwnProperty.call(this.events, key)) {
        const [eventName, selector] = key.split("@");
        [...this.el.querySelectorAll(`${selector}`)].forEach((elem) => {
          elem.addEventListener(
            `${eventName}`,
            this.events[key].bind(this),
            true
          );
        });
      }
    }
  }

  private onMount = (): void => {
    setTimeout(() => {
      this.el.innerHTML = this.render();
      this.subscribeToEvents();
    }, 0);
  };

  abstract render(): string;
}
