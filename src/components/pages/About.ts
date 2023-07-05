import Component from "../basic/Component";
import spongebob from "../../assets/images/spongebob.jpg";

export class About extends Component {
  constructor(...props: [el: HTMLElement, initialState?: Record<string, any>]) {
    super(...props);

    this.state.eventBus.once("initialLoad", () => {
      this.setState({});
    });
  }

  handleClickGithub = (e: Event) => {
    window.open("https://github.com/Djess-V/otus--homework--19");
  };

  events = {
    "click@.github": this.handleClickGithub,
  };

  render() {
    return `      
        <div class="modal-wrapper__modal modal ">
          <div
            class="modal__content content-modal"
          >
            <div class="content-modal__header">
              <h2 class="content-modal__header_title">About</h2>                           
            </div>
            <div class='content-modal__body body-modal body-modal-about'>
                <img src=${spongebob} alt="SpongeBob" width="148px" height="180px" />
                <table>
                  <tr>
                    <td>Title:</td>
                    <td>My Calendar</td>
                  </tr>
                  <tr>
                    <td>Author:</td>
                    <td>Djess-V</td>
                  </tr>
                  <tr>
                    <td>GitHub:</td>
                    <td><span class="github" >https://github.com/Djess-V/otus--homework--19</span></td>
                  </tr>
                </table>                
            </div>
            <div class="content-modal__footer footer-content-modal footer-modal-about">
              <h3>Description</h3>
              <p>The application provides the following pages: Calendar, Tasks, About. All views allow you to create, edit, delete tasks (title, description, progress status, date), filter by progress status, do a fuzzy search. The status is displayed on the url (you can save it to bookmarks).</p>       
            </div>
          </div>
        </div>
      
    `;
  }
}
