import {PageMode, RenderPosition, UserAction} from "../const";
import {removeElement, renderElement} from "../utils/render";
import StatisticPageView from "../view/statistic-page";

export default class AppPageModePresenter {
  constructor(boardContainer, filmsModel, pageModeModel, movieListPresenter) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._movieListPresenter = movieListPresenter;
    this._pageModeModel = pageModeModel;

    this._statisticsPageComponent = null;

    this._handleModeEvent = this._handleModeEvent.bind(this);
  }

  init() {
    this._pageModeModel.addObserver(this._handleModeEvent);
  }

  _handleModeEvent(actionType, pageMode) {
    switch (actionType) {
      case UserAction.CHANGE_MODE:
        switch (pageMode) {
          case PageMode.FILMS:
            removeElement(this._statisticsPageComponent);
            this._movieListPresenter.init(false);
            break;
          case PageMode.STATISTICS:
            this._movieListPresenter.destroy();
            this._statisticsPageComponent = new StatisticPageView(this._filmsModel.getFilms());
            renderElement(this._boardContainer, this._statisticsPageComponent, RenderPosition.BEFOREEND);
            break;
        }
        break;
    }
  }
}
