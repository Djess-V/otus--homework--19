import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { ITask } from "../../api/Task";
import { store } from "../../store/store";
import { deleteTask, updateTask } from "../../slices/sliceTask";
import { changeId } from "../../slices/sliceIdCurrentTaskToUpdate";

interface ISearchFormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export class Tasks extends Component {
  handleFormSubmit = (e: Event) => {
    e.preventDefault();

    const elements = (e.target as HTMLFormElement)
      .elements as ISearchFormElements;

    this.state.reloadUrl(`&search=${elements.text.value}`);
  };

  handleClickCreateTask = () => {
    this.state.reloadUrl("", "/create");
  };

  handleClickDeleteTask = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      await this.state.storage.delete(id);

      store.dispatch(deleteTask(id));

      this.state.reloadUrl();
    }
  };

  handleClickUpdateText = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      store.dispatch(changeId(id));

      this.state.reloadUrl("", "/update", id);
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
    `;
  }
}
