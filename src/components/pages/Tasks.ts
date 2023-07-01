import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { ITask, getNewTask } from "../../api/Task";
import { ModalCreateTask } from "../modals/ModalCreateTask";
import { ModalFilter } from "../modals/ModalFilter";
import { ModalUpdateTask } from "../modals/ModalUpdateTask";
import { store } from "../../store/store";
import { addTask, deleteTask, updateTask } from "../../slices/sliceTask";

export class Tasks extends Component {
  createTask = async (text: string, tags: string) => {
    const task = getNewTask(text, tags);

    await this.state.storage.createTask(task);

    store.dispatch(addTask(task));

    this.setState({ tasks: store.getState().tasks });
  };

  updateText = async (id: string, text: string) => {
    await this.state.storage.update(id, text);

    store.dispatch(updateTask({ id, data: text }));

    this.setState({ tasks: store.getState().tasks });
  };

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

    new ModalCreateTask(modals, { createTask: this.createTask });
  };

  handleClickDeleteTask = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      await this.state.storage.delete(id);

      store.dispatch(deleteTask(id));

      this.setState({ tasks: store.getState().tasks });
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

      this.setState({ tasks: store.getState().tasks });
    }
  };

  events = {
    "submit@.form-search-tasks": this.handleFormSubmit,
    "click@.buttons-up-tasks__button-filter": this.handleClickFilter,
    "click@.tasks__button-create-task": this.handleClickCreateTask,
    "click@.delete__button": this.handleClickDeleteTask,
    "click@.update__button": this.handleClickUpdateText,
    "click@.status__input": this.handleClickStatusTask,
  };

  render() {
    let taskSelection: ITask[];
    let createIsDisabled = false;
    let showAllTasks = false;

    if (
      "month" in this.state.dateInfo &&
      "year" in this.state.dateInfo &&
      "day" in this.state.dateInfo
    ) {
      taskSelection = <ITask[]>this.state.tasks.filter((task: ITask) => {
        const taskDate = new Date(task.createdAt);

        return (
          this.state.dateInfo.year === String(taskDate.getFullYear()) &&
          this.state.dateInfo.month === String(taskDate.getMonth() + 1) &&
          this.state.dateInfo.day === String(taskDate.getDate())
        );
      });

      createIsDisabled =
        (this.state.dateNow as Date).getTime() -
          new Date(
            Number(this.state.dateInfo.year),
            Number(this.state.dateInfo.month) - 1,
            Number(this.state.dateInfo.day),
            23,
            59,
            59,
            999
          ).getTime() >
        0;
    } else {
      taskSelection = this.state.tasks;
      showAllTasks = true;
    }

    const tasksExist = !!taskSelection.length;

    const listTasks = `${taskSelection
      .map((task, i, array) => {
        let entry = "";

        const date = new Date(task.createdAt);

        const dateString = `${addZero(date.getDate())}.${addZero(
          date.getMonth() + 1
        )}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(
          date.getMinutes()
        )}`;

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
            <div class="task__createdAt task__createdAt_value">${dateString}</div>
      </li>${i === array.length - 1 ? "<hr/>" : ""}`;

        return entry;
      })
      .join("")}`;

    return `
    ${
      tasksExist
        ? `<div class='tasks _container'>
        ${
          showAllTasks
            ? "<div class='all-tasks' >These are all your tasks!</div>"
            : ""
        } 
       <form class='tasks__form-search form-search-tasks'>
        <input class='form-search-tasks__inpit _input' required/>
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
      ${
        createIsDisabled
          ? ""
          : "<button class='tasks__button-create-task _button' >Create a task</button>"
      }     
    </div>`
        : `<div class='no-tasks' >No Tasks!</div>`
    }
    <div class="modals" ></div>    
    `;
  }
}
