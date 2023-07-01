import Component from "../basic/Component";

export class ModalCreateTask extends Component {
  handleClickCancel = () => {
    const modalBackdrop = this.el.querySelector(
      ".app__modal-backdrop"
    ) as HTMLElement;
    const modalWrapper = this.el.querySelector(
      ".app__modal-wrapper"
    ) as HTMLElement;

    modalBackdrop.remove();
    modalWrapper.remove();
  };

  handleClickCreateTask = async () => {
    const inputText = this.el.querySelector(
      ".body-modal-create__input_type_create"
    ) as HTMLInputElement;

    const inputTags = this.el.querySelector(
      ".body-modal-create__input_type_tags"
    ) as HTMLInputElement;

    if (
      inputText.value === "" ||
      !/^$|^([а-яёА-ЯЁa-zA-Z0-9\s]+\s?)$|^([а-яёА-ЯЁa-zA-Z0-9\s]+,\s?)+/.test(
        inputTags.value
      )
    ) {
      const errorMessage = this.el.querySelector(
        ".body-modal__error-message"
      ) as HTMLElement;

      errorMessage.style.display = "block";

      setTimeout(() => {
        errorMessage.style.display = "";
      }, 7000);
    } else {
      this.state.createTask(inputText.value, inputTags.value);

      const buttonCancel = this.el.querySelector(
        ".footer-content-modal__button-cancel"
      ) as HTMLButtonElement;

      buttonCancel.click();
    }
  };

  events = {
    "click@.footer-content-modal__button-cancel": this.handleClickCancel,
    "click@.footer-content-modal__button-create": this.handleClickCreateTask,
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
               <div class='content-modal__body body-modal body-modal-create'>
                   <label class='body-modal-create__label'>Describe</label>
                   <input class='body-modal-create__input_type_create _input'/>
                   <br/>                  
                   <label class='body-modal-create__label'>Tags</label>
                   <input class='body-modal-create__input_type_tags _input' placeholder='Tags, enter a comma'/> 
                   <p class='body-modal__message'>Tags are displayed when you hover the mouse cursor over the task text</p>                 
                   <p class='body-modal__error-message'>The task description field should not be empty, tags can be left blank or filled in as required</p>
               </div>
               <div class="content-modal__footer footer-content-modal">
                 <button class="footer-content-modal__button-create _button">
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
