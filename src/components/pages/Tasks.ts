import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { IDataToCreateTheDate, ITask, getNewTask } from "../../api/Task";
import { store, selectTask } from "../../store/store";
import { addTask, deleteTask, updateTask } from "../../slices/sliceTask";
import { ModalUpdateTask } from "../modals/ModalUpdateTask";
import { ModalCreateTask } from "../modals/ModalCreateTask";
import { toggle } from "../../slices/sliceCompleted";
import {
  addCurrentTasks,
  clearSearch,
  deleteTaskBySearch,
  updateSearch,
} from "../../slices/sliceSearch";

interface ISearchFormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export class Tasks extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    this.state.eventBus.once("initialLoad", () => {
      this.setState({ tasks: store.getState().tasks });
    });
  }

  handleFormSubmit = (e: Event) => {
    e.preventDefault();

    const elements = (e.target as HTMLFormElement)
      .elements as ISearchFormElements;

    if (elements.text.value.includes("&")) {
      elements.text.value = "";
      elements.text.placeholder = "Do not enter - &. Everything will break!";
      return;
    }

    const tasks: ITask[] = this.state.searchTasks(
      elements.text.value,
      store.getState().search.currentTasks
    );

    store.dispatch(
      updateSearch({ flag: true, tasks, value: elements.text.value })
    );

    this.setState({});
  };

  handleClickDeleteTask = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      await this.state.storage.delete(id);

      store.dispatch(deleteTask(id));

      if (store.getState().search.flag) {
        store.dispatch(deleteTaskBySearch(id));
      }

      this.setState({});
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
    }
  };

  handleClickUpdateTask = async (e: Event) => {
    const { id } = (e.target as HTMLInputElement).dataset;

    if (id) {
      const modals = this.el.querySelector(".modals") as HTMLElement;

      const text = this.el.querySelector(
        `[data-taskText='${id}']`
      ) as HTMLDivElement;

      new ModalUpdateTask(modals, {
        id,
        text: text.textContent,
        updateTask: this.updateTask,
      });
    }
  };

  updateTask = async (id: string, text: string) => {
    await this.state.storage.update(id, text);

    store.dispatch(updateTask({ id, data: text }));

    store.dispatch(clearSearch());

    this.setState({});
  };

  handleClickCreateTask = async () => {
    const modals = this.el.querySelector(".modals") as HTMLElement;

    new ModalCreateTask(modals, { createTask: this.createTask });
  };

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

    if (store.getState().completed) {
      store.dispatch(toggle());
    }

    store.dispatch(clearSearch());

    this.setState({});
  };

  handleClickShowCompleted = async () => {
    store.dispatch(toggle());

    this.setState({});
  };

  events = {
    "submit@.form-search-tasks": this.handleFormSubmit,
    "click@.delete__button": this.handleClickDeleteTask,
    "click@.status__input": this.handleClickStatusTask,
    "click@.update__button": this.handleClickUpdateTask,
    "click@.tasks__button-create-task": this.handleClickCreateTask,
    "click@.checkbox-completed__input": this.handleClickShowCompleted,
  };

  render() {
    let tasks = selectTask(store.getState());
    const { completed, search } = store.getState();

    if (search.flag) {
      const { findTasks } = search;

      if (completed) {
        tasks = findTasks.filter((item) => item.status === completed);
      } else {
        tasks = findTasks;
      }
    } else {
      store.dispatch(addCurrentTasks(tasks));
    }

    let isPast = false;
    let date: string;

    if (!this.state.showAll) {
      tasks = tasks.filter((task) => {
        const taskDate = new Date(task.dateOfExecution);

        return (
          this.state.dateInfo.year === taskDate.getFullYear() &&
          this.state.dateInfo.month === taskDate.getMonth() &&
          this.state.dateInfo.day === taskDate.getDate()
        );
      });

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

    const tasksExist = !!tasks.length;

    const listTasks = `${tasks
      .map((task, i, array) => {
        let entry = "";

        const taskdate = new Date(task.dateOfExecution);

        const dateString = `${addZero(taskdate.getDate())}.${addZero(
          taskdate.getMonth() + 1
        )}.${taskdate.getFullYear()} ${addZero(taskdate.getHours())}:${addZero(
          taskdate.getMinutes()
        )}`;

        entry = `<li class="tasks__task task task-${task.id}"'>
                  <div class="task__text text-task" title='Tags - ${task.tags.join(
                    ", "
                  )}' data-taskText='${task.id}'>${task.text}</div>
                  <div class="task__options task__options_type_status status"><input class="status__input" type="checkbox" ${
                    task.status ? "checked" : ""
                  } data-id='${task.id}'/></div>
                  <div class="task__options task__options_type_update update">              
                    <button class="update__button _task-button" data-id='${
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
        <input name="text" class='form-search-tasks__input _input' required/>
        <button name="button" class="form-search-tasks__button _button" type="submit">Find the task</button>              
      </form>`
           : ""
       }
       ${
         search.flag
           ? `<p class='tasks__search-message'>Search: &laquo;${
               search.value
             }&raquo;.     Found: ${tasks.length} task${
               tasks.length === 1 ? "" : "s"
             }.</p>`
           : ""
       }     
      <div class="tasks__checkbox checkbox-completed" >
        <label class="checkbox-completed__container">Show completed
          <input class="checkbox-completed__input" type="checkbox" ${
            completed ? "checked" : ""
          }>
          <span class="checkmark"></span>
        </label>       
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
          : `
          <button class='tasks__button-create-task _button' >Create a task</button>`
      }     
    </div>
    <section class="modals" ></section>  
    `;
  }
}
