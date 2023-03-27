import AbstractComponentView from './abstract.js';

export default class Smart extends AbstractComponentView {
  constructor() {
    super();
    this._data = {};


  }

  updateElement() {
    // - записать старый DOM-элемент
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    // - удалить старый DOM-элемент
    this.removeElement();

    // - создать новый DOM-элемент
    const newElement = this.getElement();

    // - поместить новый элемент вместо старого
    parent.replaceChild(newElement, prevElement);

    // - восстановить обработчики событий, вызвав restoreHandlers
    this.restoreHandlers();
  }

  updateData(target = {}, update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign(target, update);

    delete this._data.destinationDescription.name;
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Этот класс восстанавливает обработчики событий, надо его написать');
  }
}
