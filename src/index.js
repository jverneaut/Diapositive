import defaults from './defaults';
import { getImmediateChildrens } from './utils/dom';

export default class Diapositive {
  /**
   * Constructs Diapositive.
   *
   * @constructs Diapositive
   * @param {String} selector
   * @param {Object} options
   */
  constructor(selector, options = defaults) {
    const allOptions = Object.assign(defaults, options);
    Object.keys(allOptions).forEach((key) => {
      this[key] = allOptions[key];
    });

    // Maintain older versions
    this.activeClassName = this.className !== 'active' ? this.className : this.activeClassName;
    if (this.className !== 'active') {
      console.warn(
        'Depreciation warning: this.className is deprecated. Use this.activeClassName instead.',
        'https://github.com/jverneaut/diapositive#options',
      );
    }

    this.index = this.startAt;

    if (typeof selector === 'string') {
      this.el = document.querySelector(selector);
    } else {
      this.el = selector;
    }

    this.childrens = getImmediateChildrens(this.el);
    this.length = this.el.children.length;

    this.goTo(this.startAt);

    if (this.autoPlay) this.start();
  }

  /**
  * Remove class from element at specified index.
  *
  * @param {Number} index
  * @returns {Void}
  */
  removeClassAtIndex = (index, className) => {
    this.childrens[index].className = this.childrens[index].className.replace(` ${className}`, '');
    this.childrens[index].className = this.childrens[index].className.replace(className, '');
  }


  /**
  * Add class to element at specified index.
  *
  * @param {Number} index
  * @returns {Void}
  */
  addClassAtIndex = (index, className) => {
    this.childrens[index].className += this.childrens[index].className.length ? ` ${className}` : `${className}`;
  }

  /**
   * Move class to previous element.
   *
   * @returns {Void}
   */
  prev = () => {
    this.goTo(this.index - 1);
  }

  /**
   * Move class to next element.
   *
   * @returns {Void}
   */
  next = () => {
    this.goTo(this.index + 1);
  }

  /**
  * Move class to specified element.
  *
  * @param {Number, String} index
  * @returns {Void}
  */
  goTo = (index) => {
    if (this.prevClassName !== '') {
      this.removeClassAtIndex((this.index + this.length - 1) % this.length, this.prevClassName);
    }
    if (this.nextClassName !== '') {
      this.removeClassAtIndex((this.index + this.length + 1) % this.length, this.nextClassName);
    }
    this.removeClassAtIndex(this.index, this.activeClassName);

    switch (true) {
      case (index < 0):
        this.index = this.length - 1;
        break;
      case (index > this.length - 1):
        this.index = 0;
        break;
      default:
        this.index = parseInt(index, 10);
    }

    if (this.prevClassName !== '') {
      this.addClassAtIndex((this.index + this.length - 1) % this.length, this.prevClassName);
    }
    if (this.nextClassName !== '') {
      this.addClassAtIndex((this.index + this.length + 1) % this.length, this.nextClassName);
    }
    this.addClassAtIndex(this.index, this.activeClassName);

    this.onchange.call(this, this.index);

    if (this.playing) {
      this.stop();
      this.start();
    }
  }

  /**
   * Start instance autoplaying
   *
   * @returns {Void}
   */
  start = () => {
    if (!this.playing) {
      this.timer = setInterval(this.next.bind(this), this.time);
      this.playing = true;
    }
  }

  /**
  * Stop instance autoplaying
  *
  * @returns {Void}
  */
  stop = () => {
    if (this.playing) {
      clearInterval(this.timer);
      this.playing = false;
    }
  }

  /**
  * Bind event to callback function
  *
  * @param {String} event
  * @param {Function} callback
  * @returns {Void}
  */
  on = (event, callback) => {
    switch (event) {
      case 'change':
        this.onchange = callback;
        break;
      default:
        console.warn('Unrecognized event:', event);
        break;
    }
  }
}
