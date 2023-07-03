import { updateTask } from "../../slices/sliceTask";
import { store } from "../../store/store";
import Component from "../basic/Component";

export class ModalUpdateTask extends Component {
  handleClickCancel = () => {
    const modalBackdrop = this.el.querySelector(
      ".app__modal-backdrop"
    ) as HTMLElement;
    const modalWrapper = this.el.querySelector(
      ".app__modal-wrapper"
    ) as HTMLElement;

    if (modalBackdrop) {
      modalBackdrop.remove();
    }

    if (modalWrapper) {
      modalWrapper.remove();
    }
  };

  handleClickUpdateTask = async () => {
    const input = this.el.querySelector(
      ".body-modal-update__input"
    ) as HTMLInputElement;

    if (input.value === "") {
      const errorMessage = this.el.querySelector(
        ".body-modal__error-message"
      ) as HTMLElement;

      if (errorMessage) {
        errorMessage.style.display = "block";
      }

      setTimeout(() => {
        if (errorMessage) {
          errorMessage.style.display = "";
        }
      }, 3000);
    } else {
      const newText = input.value.replace(/[<>]/gi, "");

      await this.state.storage.update(this.state.id, newText);

      store.dispatch(updateTask({ id: this.state.id, data: newText }));

      window.history.back();
    }
  };

  events = {
    "click@.footer-content-modal__button-cancel": this.handleClickCancel,
    "click@.footer-content-modal__button-update": this.handleClickUpdateTask,
  };

  render() {
    return `
      <div class="app__modal-backdrop"></div>
      <div class='app__modal-wrapper modal-wrapper'>
        <div class="modal-wrapper__modal modal ">
          <div class="modal__content content-modal">
            <div class="content-modal__header">
              <h3 class="content-modal__header_title">Update the task</h3>
            </div>
            <div class='content-modal__body body-modal body-modal-update'>               
              <label>Make changes</label>
              <input class='body-modal-update__input _input' value="${this.state.text}"/>
              <p class='body-modal__error-message'>An empty line is not allowed</p>
            </div>
            <div class="content-modal__footer footer-content-modal">
              <button class="footer-content-modal__button-update _button">
                Update
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
