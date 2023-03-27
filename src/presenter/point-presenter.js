import {render, replace, remove} from '../util/render.js';
import RoutePoint from '../view/route-point.js';
import EditPoint from '../view/edit-point.js';
import {RENDER_POSITION, USER_ACTION, UPDATE_TYPE} from '../util/const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

export default class PointPresenter {

  constructor(board, changeData, changeMode, pointsModel) {
    this._board = board;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointsModel = pointsModel;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleOpenEditFormClick = this._handleOpenEditFormClick.bind(this);
    this._handleFromSubmit = this._handleFromSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._escReplaceEvent = this._escReplaceEvent.bind(this);
    this._handleChangeMode = this._handleChangeMode.bind(this);
  }

  init(point) {
    this._point = point;
    this._allOffers = this._pointsModel.getPointOffers();
    this._pointDestinations = this._pointsModel.getDestinations();

    const prevPoint = this._pointComponent;
    const prevEditPoint = this._editPointComponent;

    this._pointComponent = new RoutePoint(this._point);
    this._editPointComponent = new EditPoint(this._point, this._allOffers, this._pointDestinations);

    this._pointComponent.setFavoriteClick(this._handleFavoriteClick);
    this._pointComponent.setOpenFormClick(this._handleOpenEditFormClick);
    this._editPointComponent.setDeleteClick(this._handleDeleteClick);
    this._editPointComponent.setClosetFormClick(this._handleFormClose);
    this._editPointComponent.setSubmitFormClick(this._handleFromSubmit);

    if (prevPoint === null || prevEditPoint === null) {
      this._renderElement();
      return;
    }

    if (this._board.contains(prevPoint.getElement())) {
      replace(this._pointComponent, prevPoint);
    }

    if (this._board.contains(prevEditPoint.getElement())) {
      replace(this._editPointComponent, prevEditPoint);
    }

    remove(prevPoint);
    remove(prevEditPoint);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editPointComponent.addDeleteOrSavingFlag({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    switch (state) {
      case 'saving':
        this._editPointComponent.addDeleteOrSavingFlag({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case 'deleting':
        this._editPointComponent.addDeleteOrSavingFlag({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case 'reset':
        this._pointComponent.shake();
        this._editPointComponent.shake(resetFormState);
        break;
    }
  }

  _renderElement() {
    render(this._board, this._pointComponent.getElement(), RENDER_POSITION.end);
  }

  _escReplaceEvent(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceEditToPoint();
    }
  }

  _replaceEditToPoint() {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener('keydown', this._escReplaceEvent);
    this._mode = Mode.DEFAULT;
  }

  _replacePointToEdit() {
    replace(this._editPointComponent, this._pointComponent);
    document.addEventListener('keydown', this._escReplaceEvent);
    this._changeMode();
    this._mode = Mode.EDIT;
  }

  _handleFormClose() {
    this._replaceEditToPoint();
  }

  _handleFromSubmit(data) {
    this._changeData(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.PATCH,
      data,
    );
  }

  _handleDeleteClick(data) {
    this._changeData(
      USER_ACTION.DELETE_POINT,
      UPDATE_TYPE.MINOR,
      data,
    );
  }

  _handleOpenEditFormClick() {
    this._replacePointToEdit();
  }

  _handleChangeMode() {
    this._replaceEditToPoint();
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.PATCH,
      Object.assign(
        {},
        this._point,
        {
          favorite: !this._point.favorite,
        },
      ),
    );
  }
}
