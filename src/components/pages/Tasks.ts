import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { ITask } from "../../slices/sliceTask";
import { ModalCreateTask } from "../modals/ModalCreateTask";
import { ModalFilter } from "../modals/ModalFilter";
import { ModalUpdateTask } from "../modals/ModalUpdateTask";

export class Tasks extends Component {
  handleFormSubmit = (e: Event) => {
    // e.preventDefault();
    // const inputSearch = this.el.querySelector(
    //   ".form-search__inpit"
    // ) as HTMLInputElement;
    // tasks = await storage.search(inputSearch.value.toLowerCase().trim());
    // if (tasks.length === 0) {
    //   const message = element.querySelector(
    //     ".form-search__message"
    //   ) as HTMLElement;
    //   message.style.opacity = "1";
    //   setTimeout(() => {
    //     message.style.opacity = "0";
    //   }, 3000);
    // } else {
    //   drawTasks(element, tasks);
    // }
    // inputSearch.value = "";
  };

  handleClickFilter = () => {
    const modals = this.el.querySelector(".modals") as HTMLElement;

    new ModalFilter(modals);
  };

  handleClickCreateTask = () => {
    const modals = this.el.querySelector(".modals") as HTMLElement;

    new ModalCreateTask(modals);
  };

  handleClickDeleteTask = (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      const task = this.el.querySelector(`[data-id='${id}']`) as HTMLElement;

      task.remove();

      const items = this.el.querySelectorAll(
        ".task"
      ) as NodeListOf<HTMLElement>;

      if (items.length === 1) {
        const tasks = this.el.querySelector(".tasks") as HTMLElement;
        tasks.innerHTML = "";
      }

      // await storage.delete(id);
    }
  };

  handleClickUpdateTask = (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      const modals = this.el.querySelector(".modals") as HTMLElement;

      const task = <ITask>(
        (<ITask[]>this.state.tasks).find((item) => item.id === id)
      );

      new ModalUpdateTask(modals, { task });
    }
  };

  handleClickStatusTask = (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      // await storage.update(id, "", input.checked);
    }
  };

  events = {
    "submit@.form-search-tasks": this.handleFormSubmit,
    "click@.buttons-up-tasks__button-filter": this.handleClickFilter,
    "click@.tasks__button-create-task": this.handleClickCreateTask,
    "click@.delete__button": this.handleClickDeleteTask,
    "click@.update__button": this.handleClickUpdateTask,
    "click@.status__input": this.handleClickStatusTask,
  };

  render() {
    const listTasks = `${(<ITask[]>this.state.tasks)
      .map((task, i, array) => {
        let entry = "";

        const dateString = `${addZero(task.createdAt.getDate())}.${addZero(
          task.createdAt.getMonth() + 1
        )}.${task.createdAt.getFullYear()} ${addZero(
          task.createdAt.getHours()
        )}:${addZero(task.createdAt.getMinutes())}`;

        if (i === 0) {
          entry = `<li class="tasks__task task task-header">
              <div class="task__text">Task description</div>
              <div class="task__options task__options_type_status">Status</div>
              <div class="task__options task__options_type_update">Change</div>
              <div class="task__options task__options_type_delete">Remove</div>
              <div class="task__createdAt">Created At</div>
            </li><hr/>`;
        }

        entry += `<li id=${task.id} class="tasks__task task" data-id='${
          task.id
        }'>
            <div class="task__text text-task" title='Tags - ${task.tags.join(
              ", "
            )}'>${task.text}</div>
            <div class="task__options task__options_type_status status"><input class="status__input" type="checkbox" ${
              task.status ? "checked" : ""
            } data-id='${task.id}'/></div>
            <div class="task__options task__options_type_update update"><button class="update__button _task-button" data-id='${
              task.id
            }'></button></div>
            <div class="task__options task__options_type_delete delete"><button class="delete__button _task-button" data-id='${
              task.id
            }'></button></div>
            <div class="task__createdAt task__createdAt_value">${dateString}</div>
      </li>${i === array.length - 1 ? "<hr/>" : ""}`;

        return entry;
      })
      .join("")}`;

    return `
    <div class="tasks _container">
      <form class="tasks__form-search form-search-tasks">
        <input class="form-search-tasks__inpit _input" required/>
        <button class="form-search-tasks__button _button" type="submit">Find the task</button>
        <p class='form-search-tasks__message'>No records were found for your query!</p>
      </form>
      <div class="tasks__buttons-up buttons-up-tasks">
        <button class="buttons-up-tasks__button-filter _button">Filter</button>
      </div> 
      <p class='tasks__message'>You have no record!</p>  
      <ol class="tasks-container">
      ${listTasks}
      </ol>
      <button class="tasks__button-create-task _button">Create a task</button>
    </div>
    <div class="modals" ></div>    
    `;
  }
}
