import View from './View';
import icon from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = '没有搜索到你想要的食谱，试试别的';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
