import Component from "../basic/Component";
import { daysOfTheWeek, months } from "../../service/constants";
import { ITask } from "../../api/Task";
import { selectTask, store } from "../../store/store";
import { toggle } from "../../slices/sliceCompleted";

export class Calendar extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    this.state.eventBus.once("initialLoad", () => {
      this.setState({ tasks: store.getState().tasks });
    });
  }

  handleClickShowCompleted = async () => {
    store.dispatch(toggle());

    this.setState({
      tasks: selectTask(store.getState()),
      completed: store.getState().completed,
    });
  };

  events = {
    "click@.checkbox-completed__input": this.handleClickShowCompleted,
  };

  render() {
    const taskSelection: Record<string, boolean> = {};

    <ITask[]>this.state.tasks.forEach((task: ITask) => {
      const taskDate = new Date(task.dateOfExecution);

      if (
        this.state.dateInfo.month === taskDate.getMonth() &&
        this.state.dateInfo.year === taskDate.getFullYear()
      ) {
        taskSelection[
          `${String(taskDate.getFullYear())}/${String(
            taskDate.getMonth()
          )}/${String(taskDate.getDate())}`
        ] = true;
      }
    });

    let dayWeek: number = this.state.dateInfo.firstNumberOfMonth.getDay();
    if (dayWeek === 0) {
      dayWeek = 7;
    }

    const rows: string[] = [];
    let passingValue = 0;

    for (let i = 0; i < 6; i += 1) {
      let cells: string[] = [];
      let searchDay = 1;

      if (i === 0) {
        cells = [...Array(7)].map((_, index) => {
          if (index + 1 === dayWeek) {
            if (index === 6) {
              passingValue = 1;
            }
            return `
              <td
                data-id='1/${this.state.dateInfo.month}/${
              this.state.dateInfo.year
            }'
                data-today='${
                  this.state.now.getFullYear() === this.state.dateInfo.year &&
                  this.state.now.getMonth() === this.state.dateInfo.month &&
                  this.state.now.getDate() === 1
                    ? "today"
                    : ``
                }'
                class="table-calendar__cell_currentMonth"
              >
              <a class='${
                `${String(this.state.dateInfo.year)}/${String(
                  this.state.dateInfo.month
                )}/1` in taskSelection
                  ? "tasks-exists"
                  : ""
              }' href="/otus--homework--19/tasks?year=${
              this.state.dateInfo.year
            }&month=${this.state.dateInfo.month}&day=1" >1</a>
              </td>
            `;
          }
          let searchDate: Date;
          if (index + 1 < dayWeek) {
            searchDate = new Date(
              this.state.dateInfo.year,
              this.state.dateInfo.month,
              1 - (dayWeek - (index + 1))
            );
          } else {
            searchDate = new Date(
              this.state.dateInfo.year,
              this.state.dateInfo.month,
              1 + (index + 1 - dayWeek)
            );
          }
          searchDay = searchDate.getDate();
          if (index === 6) {
            passingValue = searchDay;
          }
          return `
              <td
                data-id='${searchDay}/${searchDate.getMonth() + 1}/${
            this.state.dateInfo.year
          }'
                data-today='${
                  this.state.now.getFullYear() === this.state.dateInfo.year &&
                  this.state.now.getMonth() === this.state.dateInfo.month &&
                  this.state.now.getDate() === searchDay &&
                  this.state.now.getMonth() === searchDate.getMonth()
                    ? "today"
                    : ``
                }'
                class='${
                  searchDate.getMonth() !== this.state.dateInfo.month
                    ? "table-calendar__cell_anotherMonth"
                    : "table-calendar__cell_currentMonth"
                }'
              >
              <a class='${
                `${String(searchDate.getFullYear())}/${String(
                  searchDate.getMonth()
                )}/${String(searchDay)}` in taskSelection
                  ? "tasks-exists"
                  : ""
              }' href="/otus--homework--19/tasks?year=${searchDate.getFullYear()}&month=${searchDate.getMonth()}&day=${searchDate.getDate()}" >${searchDay}</a>
              </td>
            `;
        });
      } else {
        cells = [...Array(7)].map(() => {
          passingValue += 1;
          const searchDate = new Date(
            this.state.dateInfo.year,
            this.state.dateInfo.month,
            passingValue
          );
          const otherSearchDay = searchDate.getDate();
          return `
            <td
              data-id='${otherSearchDay}/${searchDate.getMonth() + 1}/${
            this.state.dateInfo.year
          }'
              data-today='${
                this.state.now.getFullYear() === this.state.dateInfo.year &&
                this.state.now.getMonth() === searchDate.getMonth() &&
                this.state.now.getDate() === otherSearchDay
                  ? "today"
                  : ``
              }'
              class='${
                searchDate.getMonth() !== this.state.dateInfo.month
                  ? "table-calendar__cell_anotherMonth"
                  : "table-calendar__cell_currentMonth"
              }'
            >
              <a class='${
                `${String(searchDate.getFullYear())}/${String(
                  searchDate.getMonth()
                )}/${String(otherSearchDay)}` in taskSelection
                  ? "tasks-exists"
                  : ""
              }' href="/otus--homework--19/tasks?year=${searchDate.getFullYear()}&month=${searchDate.getMonth()}&day=${searchDate.getDate()}" >${otherSearchDay}</a>
            </td>
          `;
        });
      }

      const row = `<tr>${cells.join("")}</tr>`;

      rows.push(row);
    }

    const tHead = `
      <thead>
        <tr>
          ${daysOfTheWeek.map((item) => `<th>${item}</th>`).join("")}
        </tr>
      </thead>
    `;

    const tBody = `<tbody>${rows.join("")}</tbody>`;

    return `
    <div class="calendar">
      <div class="calendar__checkbox checkbox-completed">        
          <label class="checkbox-completed__container">Show completed
          <input class="checkbox-completed__input" type="checkbox" ${
            this.state.completed ? "checked" : ""
          }>
          <span class="checkmark"></span>
        </label></a>                
      </div> 
      <div class="legend" >
        <p><span class="today"></span>&nbsp;- today</p>
        <p><span class="task-exist"></span>&nbsp;- tasks exist</p>
      </div>     
      <div class="calendar__header header-calendar">        
        <a class="header-calendar__arrow-left" href="/otus--homework--19/calendar?year=${
          this.state.dateInfo.month !== 0
            ? this.state.dateInfo.year
            : this.state.dateInfo.year - 1
        }&month=${
      this.state.dateInfo.month !== 0 ? this.state.dateInfo.month - 1 : 11
    }" >&larr;</a>
        <div class="header-calendar__title">
          ${months[this.state.dateInfo.month]} ${this.state.dateInfo.year}
        </div>
        <a class="header-calendar__arrow-right" href="/otus--homework--19/calendar?year=${
          this.state.dateInfo.month !== 11
            ? this.state.dateInfo.year
            : this.state.dateInfo.year + 1
        }&month=${
      this.state.dateInfo.month !== 11 ? this.state.dateInfo.month + 1 : 0
    }" >&rarr;</a>        
      </div>
      <table class="calendar__table table-calendar">
        ${tHead}
        ${tBody}
      </table>
    </div>`;
  }
}
