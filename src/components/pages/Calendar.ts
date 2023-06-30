import Component from "../basic/Component";
import { daysOfTheWeek, months } from "../../service/constants";

export class Calendar extends Component {
  render() {
    let dayWeek: number = this.state.firstNumberOfMonth.getDay();
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
                  this.state.firstNumberOfMonth.getMonth() + 1
                }/${this.state.firstNumberOfMonth.getFullYear()}'
                data-today='${
                  this.state.dateNow.getFullYear() ===
                    this.state.firstNumberOfMonth.getFullYear() &&
                  this.state.dateNow.getMonth() ===
                    this.state.firstNumberOfMonth.getMonth() &&
                  this.state.dateNow.getDate() === 1
                    ? "today"
                    : ``
                }'
                class="table-calendar__cell_currentMonth"
              >
              <a href="/tasks/${this.state.firstNumberOfMonth.getFullYear()}/${
              months[this.state.firstNumberOfMonth.getMonth()]
            }/1" >1</a>
              </td>
            `;
          }
          let searchDate: Date;
          if (index + 1 < dayWeek) {
            searchDate = new Date(
              this.state.firstNumberOfMonth.getFullYear(),
              this.state.firstNumberOfMonth.getMonth(),
              this.state.firstNumberOfMonth.getDate() - (dayWeek - (index + 1))
            );
          } else {
            searchDate = new Date(
              this.state.firstNumberOfMonth.getFullYear(),
              this.state.firstNumberOfMonth.getMonth(),
              this.state.firstNumberOfMonth.getDate() + (index + 1 - dayWeek)
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
          }/${this.state.firstNumberOfMonth.getFullYear()}'
                data-today='${
                  this.state.dateNow.getFullYear() ===
                    this.state.firstNumberOfMonth.getFullYear() &&
                  this.state.dateNow.getMonth() ===
                    this.state.firstNumberOfMonth.getMonth() &&
                  this.state.dateNow.getDate() === searchDay &&
                  this.state.dateNow.getMonth() === searchDate.getMonth()
                    ? "today"
                    : ``
                }'
                class='${
                  searchDate.getMonth() !==
                  this.state.firstNumberOfMonth.getMonth()
                    ? "table-calendar__cell_anotherMonth"
                    : "table-calendar__cell_currentMonth"
                }'
              >
              <a href="/tasks/${searchDate.getFullYear()}/${
            months[searchDate.getMonth()]
          }/${searchDate.getDate()}" >${searchDay}</a>
              </td>
            `;
        });
      } else {
        cells = [...Array(7)].map(() => {
          passingValue += 1;
          const searchDate = new Date(
            this.state.firstNumberOfMonth.getFullYear(),
            this.state.firstNumberOfMonth.getMonth(),
            passingValue
          );
          const otherSearchDay = searchDate.getDate();
          return `
            <td
              data-id='${otherSearchDay}/${
            searchDate.getMonth() + 1
          }/${this.state.firstNumberOfMonth.getFullYear()}'
              data-today='${
                this.state.dateNow.getFullYear() ===
                  this.state.firstNumberOfMonth.getFullYear() &&
                this.state.dateNow.getMonth() === searchDate.getMonth() &&
                this.state.dateNow.getDate() === otherSearchDay
                  ? "today"
                  : ``
              }'
              class='${
                searchDate.getMonth() !==
                this.state.firstNumberOfMonth.getMonth()
                  ? "table-calendar__cell_anotherMonth"
                  : "table-calendar__cell_currentMonth"
              }'
            >
              <a href="/tasks/${searchDate.getFullYear()}/${
            months[searchDate.getMonth()]
          }/${searchDate.getDate()}" >${otherSearchDay}</a>
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
          this.state.indexOfMonth !== 0
            ? months[this.state.indexOfMonth - 1]
            : months[11]
        }&year=${
      this.state.indexOfMonth !== 0 ? this.state.year : this.state.year - 1
    }" >&larr;</a>
        <div class="header-calendar__title">
          ${
            months[this.state.firstNumberOfMonth.getMonth()]
          } ${this.state.firstNumberOfMonth.getFullYear()}
        </div>
        <a class="header-calendar__arrow-right" href="/calendar?month=${
          this.state.indexOfMonth !== 11
            ? months[this.state.indexOfMonth + 1]
            : months[0]
        }&year=${
      this.state.indexOfMonth !== 11 ? this.state.year : this.state.year + 1
    }" >&rarr;</a>        
      </div>
      <table class="calendar__table table-calendar">
        ${tHead}
        ${tBody}
      </table>
    </div>`;
  }
}
