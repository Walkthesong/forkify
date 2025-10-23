import icon from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Jonas Schmedtmann
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markUp = this._generateMarkup();

    //只想要返回的字符串，不想要插入到DOM中
    if (!render) return markUp;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  //因为调整份量的按钮使用render方法，会导致所有数据都重新加载，比如图片；如果多次点击按钮可能会出现闪烁现象，影响观感
  //所有我们需要新设计一个updateDOM方法，只更新有修改的地方
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError;

    this._data = data;
    const newMarkup = this._generateMarkup();

    //创建DOM对象，但是它是虚拟DOM存在于内存中
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //判断条件为比较完之后不同的节点和是节点里面只包含文本的元素，这两个条件全符合才执行
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //节点元素的第一个子元素是文本元素
        curEl.textContent = newEl.textContent;
      }

      //更改属性
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
            <div class="spinner">
              <svg>
                <use href="${icon}#icon-loader"></use>
              </svg>
              </div>
          `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
        <div class="error">
            <div>     
            <svg>   
            <use href="${icon}#icon-alert-triangle"></use>
            </svg>
            </div>  
            <p>${message}</p>
        </div>  
        `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icon}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
