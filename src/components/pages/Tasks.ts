import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { IDataToCreateTheDate, ITask, getNewTask } from "../../api/Task";
import { ModalCreateTask } from "../modals/ModalCreateTask";
import { ModalUpdateTask } from "../modals/ModalUpdateTask";
import { store } from "../../store/store";
import { addTask, deleteTask, updateTask } from "../../slices/sliceTask";

interface ISearchFormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export class Tasks extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    if (this.state.search && !this.state.tasks.length) {
      this.hideSearchMessage();
    }
  }

  createTask = async (
    text: string,
    tags: string,
    hours: string,
    minutes: string
  ) => {
    const dataToCreateTheDate: IDataToCreateTheDate = {
      year: Number(this.state.dateInfo.year),
      month: Number(this.state.dateInfo.month),
      day: Number(this.state.dateInfo.day),
      hours: Number(hours),
      minutes: Number(minutes),
    };

    const task = getNewTask(text, tags, dataToCreateTheDate);

    await this.state.storage.createTask(task, dataToCreateTheDate);

    store.dispatch(addTask(task));

    await this.state.reloadUrl();
  };

  updateText = async (id: string, text: string) => {
    await this.state.storage.update(id, text);

    store.dispatch(updateTask({ id, data: text }));

    this.state.reloadUrl();
  };

  handleFormSubmit = (e: Event) => {
    e.preventDefault();

    const elements = (e.target as HTMLFormElement)
      .elements as ISearchFormElements;

    this.state.reloadUrl(`&search=${elements.text.value}`);
  };

  handleClickCreateTask = () => {
    const modals = this.el.querySelector(".modals") as HTMLElement;

    new ModalCreateTask(modals, { createTask: this.createTask });
  };

  handleClickDeleteTask = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      await this.state.storage.delete(id);

      store.dispatch(deleteTask(id));

      this.state.reloadUrl();
    }
  };

  handleClickUpdateText = (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      const divText = <HTMLDivElement>(
        this.el.querySelector(`[data-taskText='${id}']`)
      );

      const text = <string>divText.textContent;

      const modals = this.el.querySelector(".modals") as HTMLElement;

      new ModalUpdateTask(modals, { id, text, updateText: this.updateText });
    }
  };

  handleClickStatusTask = async (e: Event) => {
    const { id } = (e.target as HTMLInputElement).dataset;

    if (id) {
      await this.state.storage.update(
        id,
        "",
        (e.target as HTMLInputElement).checked
      );

      store.dispatch(
        updateTask({ id, data: (e.target as HTMLInputElement).checked })
      );

      this.state.reloadUrl();
    }
  };

  hideSearchMessage = () => {
    const message = this.el.querySelector(
      ".form-search-tasks__message"
    ) as HTMLElement;

    setTimeout(() => {
      if (message) {
        message.style.opacity = "0";
      }
    }, 3000);
  };

  events = {
    "submit@.form-search-tasks": this.handleFormSubmit,
    "click@.tasks__button-create-task": this.handleClickCreateTask,
    "click@.delete__button": this.handleClickDeleteTask,
    "click@.update__button": this.handleClickUpdateText,
    "click@.status__input": this.handleClickStatusTask,
  };

  render() {
    let isPast = false;
    let date: string;

    if (!this.state.showAll) {
      isPast =
        (this.state.now as Date).getTime() -
          new Date(
            this.state.dateInfo.year,
            this.state.dateInfo.month,
            this.state.dateInfo.day,
            23,
            59,
            59,
            999
          ).getTime() >
        0;

      date = `${addZero(this.state.dateInfo.day)}.${addZero(
        this.state.dateInfo.month + 1
      )}.${this.state.dateInfo.year}`;
    } else {
      date = `All tasks!`;
    }

    const tasksExist = !!this.state.tasks.length;

    const listTasks = `${(this.state.tasks as ITask[])
      .map((task, i, array) => {
        let entry = "";

        const taskdate = new Date(task.dateOfExecution);

        const dateString = `${addZero(taskdate.getDate())}.${addZero(
          taskdate.getMonth() + 1
        )}.${taskdate.getFullYear()} ${addZero(taskdate.getHours())}:${addZero(
          taskdate.getMinutes()
        )}`;

        entry = `<li id=${task.id} class="tasks__task task" data-id='${
          task.id
        }'>
            <div class="task__text text-task" title='Tags - ${task.tags.join(
              ", "
            )}' data-taskText='${task.id}'>${task.text}</div>
            <div class="task__options task__options_type_status status"><input class="status__input" type="checkbox" ${
              task.status ? "checked" : ""
            } data-id='${task.id}'/></div>
            <div class="task__options task__options_type_update update"><button class="update__button _task-button" data-id='${
              task.id
            }'></button></div>
            <div class="task__options task__options_type_delete delete"><button class="delete__button _task-button" data-id='${
              task.id
            }'></button></div>
            <div class="task__dateOfExecution task__dateOfExecution_value">${dateString}</div>
      </li>${i === array.length - 1 ? "<hr/>" : ""}`;

        return entry;
      })
      .join("")}`;

    return `          
    <div class='tasks _container'> 
      <div class="tasks-date" >Date: ${date}</div>       
       ${
         tasksExist
           ? `<form class='tasks__form-search form-search-tasks'>
        <input name="text" class='form-search-tasks__inpit _input' required/>
        <button name="button" class="form-search-tasks__button _button" type="submit">Find the task</button>
        ${
          this.state.search &&
          `<p class='form-search-tasks__message'>Search: &laquo;${
            this.state.search
          }&raquo;.     Found: ${this.state.tasks.length} task${
            this.state.tasks.length === 1 ? "" : "s"
          }.</p>`
        }
      </form>`
           : ""
       }     
      <div class="tasks__checkbox checkbox-completed" >
        <a class="checkbox-completed__link" href='/tasks?${
          this.state.showAll
            ? `all=1&completed=${this.state.completed ? "0" : "1"}${
                this.state.search ? `&search=${this.state.search}` : ""
              }`
            : `year=${this.state.dateInfo.year}&month=${
                this.state.dateInfo.month
              }&day=${this.state.dateInfo.day}&completed=${
                this.state.completed ? "0" : "1"
              }${this.state.search ? `&search=${this.state.search}` : ""}`
        }'><label class="checkbox-completed__container">Show completed
          <input type="checkbox" ${this.state.completed ? "checked" : ""}>
          <span class="checkmark"></span>
        </label></a>        
      </div>               
      <ol class="tasks-container">
        <li class="tasks__task task task-header">
          <div class="task__text">Task description</div>
          <div class="task__options task__options_type_status">Status</div>
          <div class="task__options task__options_type_update">Change</div>
          <div class="task__options task__options_type_delete">Remove</div>
          <div class="task__dateOfExecution">Date of execution</div>
        </li><hr/>
      ${listTasks}
      </ol>
      ${
        isPast || this.state.showAll
          ? ""
          : "<button class='tasks__button-create-task _button' >Create a task</button>"
      }     
    </div>
    <div class="modals" ></div>    
    `;
  }
}
