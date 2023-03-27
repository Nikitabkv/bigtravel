import {createElement} from '../util/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error('Это абстрактный класс, с помощью него надо другие делать!!!!!!');
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Надо самому написать метод: getTemplate');
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  show() {
    this._element.classList.remove('visually-hidden');
  }

  hide() {
    this._element.classList.add('visually-hidden');
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
