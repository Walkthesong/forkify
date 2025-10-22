import View from './View';
import icon from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //页数为1，有其他页
    if (curPage === 1 && numPage > 1) {
      return `
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-right"></use>
        </svg>
        </button> 
        `;
    }

    //页数不为1
    if (curPage < numPage) {
      return `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-right"></use>
        </svg>
        </button>
        `;
    }

    //页数为最后一页
    if (curPage === numPage) {
      return `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icon}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
        </button>
        `;
    }

    //只有一页
    if (curPage === 1 && numPage === 1) {
      return '';
    }
  }
}

export default new PaginationView();
