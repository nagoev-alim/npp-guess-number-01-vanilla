// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import confetti from 'canvas-confetti';
import { getRandomNumber } from './modules/getRandomNumber.js';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='guess-number'>
    <h1>Guess Number</h1>
    <p>Guess the number is a game in which you have to guess the number given by the computer between 0 and 10. Use as few tries as possible. Good luck!</p>
    <form data-form>
      <label>
        <input type='number' name='guess' placeholder='Enter the number'>
      </label>
    </form>
    <div class='alert hide' data-alert></div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Class
class App {
  constructor() {
    this.DOM = {
      form: document.querySelector('[data-form]'),
      alert: document.querySelector('[data-alert]'),
    };

    this.PROPS = {
      secret: getRandomNumber(1, 10),
      attempts: 3,
    };

    this.DOM.form.addEventListener('submit', this.onSubmit);
    console.log(`The number that was guessed is ${this.PROPS.secret}`);
  }

  /**
   * @function onSubmit - Form submit handler
   * @param event
   */
  onSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const guess = parseInt(Object.fromEntries(new FormData(form).entries()).guess);

    if (guess < 0 || guess > 10) {
      showNotification('warning', 'Please enter a number from 0 to 10!');
      return;
    }

    if (guess === this.PROPS.secret) {
      form.remove();
      this.showMessage('success', 'You guessed it 🥳!');
      confetti({
        angle: getRandomNumber(55, 125),
        spread: getRandomNumber(50, 70),
        particleCount: getRandomNumber(50, 100),
        origin: { y: 0.6 },
      });
      this.restart();
    }
    // Not passed
    if (guess !== this.PROPS.secret) {
      this.PROPS.attempts--;

      if (this.PROPS.attempts === 0) {
        form.remove();
        this.showMessage('lost', `You lost 🥲! The number you guessed - ${this.PROPS.secret}`);
        this.restart();
      } else {
        this.showMessage('error', `Try again. Attempts left ${this.PROPS.attempts}`);
        form.reset();
      }
    }
  };

  /**
   * @function showMessage - Show message
   * @param type
   * @param text
   */
  showMessage = (type, text) => {
    const input = document.querySelector('input');

    this.DOM.alert.textContent = text;

    switch (type) {
      case 'error':
        this.DOM.alert.classList.add('show', 'error');
        input.classList.add('error');
        input.disabled = true;

        setTimeout(() => {
          this.DOM.alert.classList.remove('show', 'error');
          input.classList.remove('error');
          input.disabled = false;
          input.focus();
        }, 3000);
        break;
      case 'lost':
        this.DOM.alert.classList.add('show', 'error');
        this.DOM.alert.insertAdjacentHTML('afterend', `<button class='button' data-restart=''>Play again?</button>`);
        break;
      case 'success':
        this.DOM.alert.classList.add('show', 'success');
        this.DOM.alert.insertAdjacentHTML('afterend', `<button class='button' data-restart=''>Play again?</button>`);
        break;
      default:
        break;
    }
  };

  /**
   * @function restart - Reload page
   */
  restart = () => document.querySelector('[data-restart]').addEventListener('click', () => location.reload());
}

// ⚡️Class Instance
new App();

