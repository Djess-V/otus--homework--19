import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { IDataToCreateTheDate, ITask, getNewTask } from "../../api/Task";
import { ModalCreateTask } from "../modals/ModalCreateTask";
import { ModalUpdateTask } from "../modals/ModalUpdateTask";
import { store } from "../../store/store";
import { addTask, deleteTask, updateTask } from "../../slices/sliceTask";

export class Tasks extends Component {
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
    "click@.tasks__button-create-task": this.handleClickCreateTask,
    "click@.delete__button": this.handleClickDeleteTask,
    "click@.update__button": this.handleClickUpdateText,
    "click@.status__input": this.handleClickStatusTask,
  };

  render() {
    let taskSelection: ITask[];
    let isPast = false;
    let date: string;

    if (!this.state.showAll) {
      taskSelection = (this.state.tasks as ITask[]).filter((task) => {
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
      taskSelection = this.state.tasks;
      date = `All tasks!`;
    }

    if (this.state.completed) {
      taskSelection = taskSelection.filter((task) => task.status);
    }

    const tasksExist = !!taskSelection.length;

    const listTasks = `${taskSelection
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
        <input class='form-search-tasks__inpit _input' required/>
        <button class="form-search-tasks__button _button" type="submit">Find the task</button>
        <p class='form-search-tasks__message'>No records were found for your query!</p>
      </form>`
           : ""
       }     
      <div class="tasks__checkbox checkbox-completed" >
        <a class="checkbox-completed__link" href='/tasks?${
          this.state.showAll
            ? `all=1&completed=${this.state.completed ? "0" : "1"}`
            : `year=${this.state.dateInfo.year}&month=${
                this.state.dateInfo.month
              }&day=${this.state.dateInfo.day}&completed=${
                this.state.completed ? "0" : "1"
              }`
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
