import * as model from './model';
import recipeView from './view/recipeView';
import searchView from './view/searchView';
import resultView from './view/resultView';
import bookmarkView from './view/bookmarkView';
import paginationView from './view/paginationView';
import addRecipeView from './view/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //在显示某个食谱时，把搜索结果列表里对应的项标为选中/highlight
    //把 update 放在这里能保证无论如何进入某个食谱（点击、书签、后退/前进、直接访问）
    //搜索结果列表都会同步高亮对应条目。
    resultView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);

    //loadRecipe是异步函数返回promise对象，需要await关键字
    // 1) 加载食谱
    await model.loadRecipe(id);

    // 2) 渲染食谱
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();

    await model.loadSearchResults(query);

    //分页
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  //重新渲染新的页数
  resultView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  //页面初加载渲染书签面板，以免update方法报错
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function () {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
};
init();
