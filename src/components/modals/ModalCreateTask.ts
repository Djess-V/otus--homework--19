import Component from "../basic/Component";

interface ICreateFormElements extends HTMLFormControlsCollection {
  description: HTMLInputElement;
  hours: HTMLInputElement;
  minutes: HTMLInputElement;
  tags: HTMLInputElement;
}

export class ModalCreateTask extends Component {
  handleClickCancel = () => {
    this.el.innerHTML = "";
  };

  handleClickCreateTask = async (e: Event) => {
    e.preventDefault();

    const elements = (e.target as HTMLFormElement)
      .elements as ICreateFormElements;

    if (
      !/^$|^([а-яёА-ЯЁa-zA-Z0-9\s]+\s?)$|^([а-яёА-ЯЁa-zA-Z0-9\s]+,\s?)+/.test(
        elements.tags.value
      )
    ) {
      const errorMessage = this.el.querySelector(
        ".body-modal__error-message"
      ) as HTMLElement;

      if (errorMessage) {
        errorMessage.style.display = "block";
      }
    } else {
      this.state.createTask(
        elements.description.value,
        elements.tags.value,
        elements.hours.value,
        elements.minutes.value
      );
    }
  };

  events = {
    "click@.footer-content-modal__button-cancel": this.handleClickCancel,
    "submit@.body-modal-create": this.handleClickCreateTask,
  };

  render() {
    return `
      <div class="app__modal-backdrop"></div>
         <div
           class='app__modal-wrapper modal-wrapper'
         >
           <div class="modal-wrapper__modal modal ">
             <div
               class="modal__content content-modal"
             >
               <div class="content-modal__header">
                 <h3 class="content-modal__header_title">Add task</h3>
               </div>
               <form id="createForm" class='content-modal__body body-modal body-modal-create'>
                   <label class='body-modal-create__label'>Describe</label>
                   <input name="description" class='body-modal-create__input_type_create _input' required/>
                   <br/>
                   <label class='body-modal-create__label'>Complete (hours)</label>
                   <input name="hours" class='body-modal-create__input_type_create-hours _input' type="number" step="1" value="0" min="0" max="23" required/>
                   <br/>
                   <label class='body-modal-create__label'>Complete (minutes)</label>
                   <input name="minutes" class='body-modal-create__input_type_create-minutes _input' type="number" step="1" value="0" min="0" max="59" required/>
                   <br/>                   
                   <label class='body-modal-create__label'>Tags</label>
                   <input name="tags" class='body-modal-create__input_type_tags _input' placeholder='Tags, enter a comma'/> 
                   <p class='body-modal__message'>Tags are displayed when you hover the mouse cursor over the task text</p>                 
                   <p class='body-modal__error-message'>The tag field may be blank or filled out as required</p>
               </form>
               <div class="content-modal__footer footer-content-modal">
                 <button form="createForm" class="footer-content-modal__button-create _button" type="submit" >
                     Add
                   </button>              
                   <button class="footer-content-modal__button-cancel _button">
                   Cancel
                 </button>            
               </div>
             </div>
           </div>
         </div>
      `;
  }
}
