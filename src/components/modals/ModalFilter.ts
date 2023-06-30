import Component from "../basic/Component";
import { filterData } from "../../service/constants";
import { ITask } from "../../slices/sliceTask";

export class ModalFilter extends Component {
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

  handleClickRadioLeft = (e: Event) => {
    const tagInput = this.el.querySelector(
      ".item-filter-body__tag-input"
    ) as HTMLInputElement;

    const radio = e.target as HTMLInputElement;

    const rightBlocks = this.el.querySelectorAll(
      `.right-filter-body`
    ) as NodeListOf<HTMLElement>;

    for (const rBlock of rightBlocks) {
      if (rBlock.id === `rBlock_${radio.value}`) {
        rBlock.style.display = "grid";
      } else {
        rBlock.style.display = "none";

        const rightInputs = rBlock.querySelectorAll(
          `.item-filter-body__radio`
        ) as NodeListOf<HTMLInputElement>;

        for (const input of rightInputs) {
          input.checked = false;
        }

        tagInput.value = "";
      }
    }
  };

  handleClickFilter = () => {
    let tasks: ITask[];
    const radioInputs = this.el.querySelectorAll(
      ".item-filter-body__radio"
    ) as NodeListOf<HTMLInputElement>;

    const checkedRadios = Array.from(radioInputs).filter(
      (item) => item.checked
    );

    const tagInput = this.el.querySelector(
      ".item-filter-body__tag-input"
    ) as HTMLInputElement;

    const buttonCancel = this.el.querySelector(
      ".footer-content-modal__button-cancel"
    ) as HTMLButtonElement;

    if (checkedRadios.length === 2) {
      //  tasks = await storage.sortBy(
      //    checkedRadios[0].value,
      //    checkedRadios[1].value
      //  );
      //  drawTasks(element, tasks);

      buttonCancel.click();
    } else if (
      checkedRadios.length === 1 &&
      checkedRadios[0].value === "tags" &&
      tagInput.value !== "" &&
      /^([а-яА-Яa-zA-Z0-9]+\s?)$|^([а-яА-Яa-zA-Z0-9]+,\s?)+/.test(
        tagInput.value
      )
    ) {
      //  tasks = await storage.sortBy(checkedRadios[0].value, tagInput.value);
      //  drawTasks(element, tasks);

      buttonCancel.click();
    } else {
      const errorMessage = this.el.querySelector(
        `.body-modal__error-message`
      ) as HTMLElement;

      errorMessage.style.display = "block";

      setTimeout(() => {
        errorMessage.style.display = "";
      }, 5000);
    }
  };

  events = {
    "click@.footer-content-modal__button-cancel": this.handleClickCancel,
    "click@.item-filter-body__radio_pos_left": this.handleClickRadioLeft,
    "click@.footer-content-modal__button-filter": this.handleClickFilter,
  };

  render() {
    const modalBody = `${filterData
      .map(
        (item, i) => `
         <div class='filter-body__item item-filter-body'>
     
           <div class='item-filter-body__left'>
             <label class='item-filter-body__label item-filter-body__label_type_left' for='${
               item.id
             }' >${item.title}</label>
             <input class='item-filter-body__radio item-filter-body__radio_pos_left item-filter-body__radio_pos_left-${
               item.id
             }' type='radio' id='${item.id}' name='filter' value='${item.id}' />
           </div>
     
           <div id='rBlock_${
             item.id
           }' class='item-filter-body__right right-filter-body item-filter-body__right_name_filter-${
          item.id
        }' >
           
             <div class='right-filter-body__up'>
               ${
                 i !== 3
                   ? `
               <label class='item-filter-body__label' for='${item.id}Up' >${
                       item.subTitle1.text
                     }</label>
               <input id='${
                 item.id
               }Up' class='item-filter-body__radio item-filter-body__radio_pos_right item-filter-body__radio_pos_right-${
                       item.id
                     }1' type='radio' name='filter-${i + 1}' value=${
                       item.subTitle1.value
                     } />`
                   : `<label class='item-filter-body__label_type_tag' for='${item.id}' >${item.subTitle1.text}</label>
               <input id='${item.id}' class="item-filter-body__tag-input _input" placeholder='Comma separated' />`
               }
             </div>
     
             ${
               i !== 3
                 ? `<div class='right-filter-body__down'>
               <label class='item-filter-body__label' for='${item.id}Down' >${
                     item.subTitle2.text
                   }</label>
               <input class='item-filter-body__radio item-filter-body__radio_pos_right item-filter-body__radio_pos_right-${
                 item.id
               }2' type='radio' id='${item.id}Down' name='filter-${
                     i + 1
                   }' value=${item.subTitle2.value} />
             </div>`
                 : ""
             }                                      
           </div>
                                      
         </div>`
      )
      .join("")}`;

    return `
      <div class="app__modal-backdrop"></div>
       <div class='app__modal-wrapper modal-wrapper'>
         <div class="modal-wrapper__modal modal ">
           <div class="modal__content content-modal">
             <div class="content-modal__header">
               <h3 class="content-modal__header_title">Sort by:</h3>
             </div>
             <div class='content-modal__body body-modal filter-body'> 
               ${modalBody}                
               <p class='body-modal__error-message'>Insufficient data for sorting or tags are entered incorrectly</p>   
             </div>
             <div class="content-modal__footer footer-content-modal">
               <button class="footer-content-modal__button-filter _button">
               Sort
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
