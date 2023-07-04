import Component from "../basic/Component";
import { addZero } from "../../service/functions";
import { ITask } from "../../api/Task";
import { store } from "../../store/store";
import { deleteTask, updateTask } from "../../slices/sliceTask";

interface ISearchFormElements extends HTMLFormControlsCollection {
  text: HTMLInputElement;
}

export class Tasks extends Component {
  handleFormSubmit = (e: Event) => {
    e.preventDefault();

    const elements = (e.target as HTMLFormElement)
      .elements as ISearchFormElements;

    if (elements.text.value.includes("&")) {
      elements.text.value = "";
      elements.text.placeholder = "Do not enter - &. Everything will break!";
      return;
    }

    const link = this.el.querySelector(
      ".form-search-tasks__link"
    ) as HTMLAnchorElement;

    if (link.href.includes(`&search=`)) {
      link.href = link.href.replace(/&search=(.+)/i, "");
      link.href += `&search=${elements.text.value}`;
    } else {
      link.href += `&search=${elements.text.value}`;
    }

    link.click();
  };

  handleClickDeleteTask = async (e: Event) => {
    const { id } = (e.target as HTMLButtonElement).dataset;

    if (id) {
      await this.state.storage.delete(id);

      store.dispatch(deleteTask(id));

      const li = this.el.querySelector(`.task-${id}`) as HTMLElement;

      li.remove();

      const ol = this.el.querySelector(`.tasks-container`) as HTMLElement;

      const lis = ol.querySelectorAll(`li`) as NodeListOf<HTMLLIElement>;

      if (lis.length === 1) {
        const hr = ol.querySelectorAll(`hr`) as NodeListOf<HTMLElement>;

        hr[1].remove();
      }
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
    "click@.delete__button": this.handleClickDeleteTask,
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

        entry = `<li class="tasks__task task task-${task.id}"'>
            <div class="task__text text-task" title='Tags - ${task.tags.join(
              ", "
            )}' data-taskText='${task.id}'>${task.text}</div>
            <div class="task__options task__options_type_status status"><input class="status__input" type="checkbox" ${
              task.status ? "checked" : ""
            } data-id='${task.id}'/></div>
            <div class="task__options task__options_type_update update">
              <a href="${window.location.origin}${
          window.location.pathname
        }/update${window.location.search}&id=${task.id}">
                <button class="update__button _task-button" data-id='${
                  task.id
                }'></button></a></div>
            <div class="task__options task__options_type_delete delete"><button class="delete__button _task-button" data-id='${
              task.id
            }'></button></div>
            <div class="task__dateOfExecution task__dateOfExecution_value">${dateString}</div>
      </li>${i === array.length - 1 ? "<hr/>" : ""}`;

        return entry;
      })
      .join("")}`;

    const generateURLForShowComplited = () => {
      let href = this.state.path as string;
      let subStr = "";
      const matchArray = href.match(/&completed=(0|1)/);

      if (!matchArray) {
        return "";
      }

      if (matchArray[0] === `&completed=0`) {
        subStr = `&completed=1`;
      } else {
        subStr = `&completed=0`;
      }

      href = href.replace(/&completed=(0|1)/, subStr);

      return href;
    };

    const hrefForShowComplited = generateURLForShowComplited();

    return `          
    <div class='tasks _container'> 
      <div class="tasks-date" >Date: ${date}</div>       
       ${
         tasksExist
           ? `<form class='tasks__form-search form-search-tasks'>
        <input name="text" class='form-search-tasks__inpit _input' required/>
        <button name="button" class="form-search-tasks__button _button" type="submit">Find the task</button>
        <a class="form-search-tasks__link" href="${this.state.path}"></a>        
      </form>`
           : ""
       }
       ${
         this.state.search &&
         `<p class='tasks__search-message'>Search: &laquo;${
           this.state.search
         }&raquo;.     Found: ${this.state.tasks.length} task${
           this.state.tasks.length === 1 ? "" : "s"
         }.</p>`
       }     
      <div class="tasks__checkbox checkbox-completed" >
        <a class="checkbox-completed__link" href='${hrefForShowComplited}'><label class="checkbox-completed__container">Show completed
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
          : `<a href="${window.location.origin}${window.location.pathname}/create${window.location.search}">
          <button class='tasks__button-create-task _button' >Create a task</button></a>`
      }     
    </div>  
    `;
  }
}
