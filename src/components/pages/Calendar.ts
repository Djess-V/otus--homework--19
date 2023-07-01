import Component from "../basic/Component";
import { daysOfTheWeek, months } from "../../service/constants";
import { ITask } from "../../api/Task";

export class Calendar extends Component {
  render() {
    const taskSelection: Record<string, boolean> = {};

    <ITask[]>this.state.tasks.forEach((task: ITask) => {
      const taskDate = new Date(task.createdAt);

      if (
        this.state.dateInfo.indexOfMonth === taskDate.getMonth() &&
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
                data-id='1/${
                  this.state.dateInfo.firstNumberOfMonth.getMonth() + 1
                }/${this.state.dateInfo.firstNumberOfMonth.getFullYear()}'
                data-today='${
                  this.state.dateInfo.dateNow.getFullYear() ===
                    this.state.dateInfo.firstNumberOfMonth.getFullYear() &&
                  this.state.dateInfo.dateNow.getMonth() ===
                    this.state.dateInfo.firstNumberOfMonth.getMonth() &&
                  this.state.dateInfo.dateNow.getDate() === 1
                    ? "today"
                    : ``
                }'
                class="table-calendar__cell_currentMonth"
              >
              <a class='${
                `${String(
                  this.state.dateInfo.firstNumberOfMonth.getFullYear()
                )}/${String(
                  this.state.dateInfo.firstNumberOfMonth.getMonth()
                )}/1` in taskSelection
                  ? "tasks-exists"
                  : ""
              }' href="/tasks?year=${this.state.dateInfo.firstNumberOfMonth.getFullYear()}&month=${
              this.state.dateInfo.firstNumberOfMonth.getMonth() + 1
            }&day=1" >1</a>
              </td>
            `;
          }
          let searchDate: Date;
          if (index + 1 < dayWeek) {
            searchDate = new Date(
              this.state.dateInfo.firstNumberOfMonth.getFullYear(),
              this.state.dateInfo.firstNumberOfMonth.getMonth(),
              this.state.dateInfo.firstNumberOfMonth.getDate() -
                (dayWeek - (index + 1))
            );
          } else {
            searchDate = new Date(
              this.state.dateInfo.firstNumberOfMonth.getFullYear(),
              this.state.dateInfo.firstNumberOfMonth.getMonth(),
              this.state.dateInfo.firstNumberOfMonth.getDate() +
                (index + 1 - dayWeek)
            );
          }
          searchDay = searchDate.getDate();
          if (index === 6) {
            passingValue = searchDay;
          }
          return `
              <td
                data-id='${searchDay}/${
            searchDate.getMonth() + 1
          }/${this.state.dateInfo.firstNumberOfMonth.getFullYear()}'
                data-today='${
                  this.state.dateInfo.dateNow.getFullYear() ===
                    this.state.dateInfo.firstNumberOfMonth.getFullYear() &&
                  this.state.dateInfo.dateNow.getMonth() ===
                    this.state.dateInfo.firstNumberOfMonth.getMonth() &&
                  this.state.dateInfo.dateNow.getDate() === searchDay &&
                  this.state.dateInfo.dateNow.getMonth() ===
                    searchDate.getMonth()
                    ? "today"
                    : ``
                }'
                class='${
                  searchDate.getMonth() !==
                  this.state.dateInfo.firstNumberOfMonth.getMonth()
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
              }' href="/tasks?year=${searchDate.getFullYear()}&month=${
            searchDate.getMonth() + 1
          }&day=${searchDate.getDate()}" >${searchDay}</a>
              </td>
            `;
        });
      } else {
        cells = [...Array(7)].map(() => {
          passingValue += 1;
          const searchDate = new Date(
            this.state.dateInfo.firstNumberOfMonth.getFullYear(),
            this.state.dateInfo.firstNumberOfMonth.getMonth(),
            passingValue
          );
          const otherSearchDay = searchDate.getDate();
          return `
            <td
              data-id='${otherSearchDay}/${
            searchDate.getMonth() + 1
          }/${this.state.dateInfo.firstNumberOfMonth.getFullYear()}'
              data-today='${
                this.state.dateInfo.dateNow.getFullYear() ===
                  this.state.dateInfo.firstNumberOfMonth.getFullYear() &&
                this.state.dateInfo.dateNow.getMonth() ===
                  searchDate.getMonth() &&
                this.state.dateInfo.dateNow.getDate() === otherSearchDay
                  ? "today"
                  : ``
              }'
              class='${
                searchDate.getMonth() !==
                this.state.dateInfo.firstNumberOfMonth.getMonth()
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
              }' href="/tasks?year=${searchDate.getFullYear()}&month=${
            searchDate.getMonth() + 1
          }&day=${searchDate.getDate()}" >${otherSearchDay}</a>
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
      <div class="calendar__header header-calendar">        
        <a class="header-calendar__arrow-left" href="/calendar?month=${
          this.state.dateInfo.indexOfMonth !== 0
            ? months[this.state.dateInfo.indexOfMonth - 1]
            : months[11]
        }&year=${
      this.state.dateInfo.indexOfMonth !== 0
        ? this.state.dateInfo.year
        : this.state.dateInfo.year - 1
    }" >&larr;</a>
        <div class="header-calendar__title">
          ${
            months[this.state.dateInfo.firstNumberOfMonth.getMonth()]
          } ${this.state.dateInfo.firstNumberOfMonth.getFullYear()}
        </div>
        <a class="header-calendar__arrow-right" href="/calendar?month=${
          this.state.dateInfo.indexOfMonth !== 11
            ? months[this.state.dateInfo.indexOfMonth + 1]
            : months[0]
        }&year=${
      this.state.dateInfo.indexOfMonth !== 11
        ? this.state.dateInfo.year
        : this.state.dateInfo.year + 1
    }" >&rarr;</a>        
      </div>
      <table class="calendar__table table-calendar">
        ${tHead}
        ${tBody}
      </table>
    </div>`;
  }
}
