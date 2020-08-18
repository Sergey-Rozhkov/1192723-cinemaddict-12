import Abstract from "../view/abstract.js";
import {RENDER_POSITION} from "../const.js";

export const renderElement = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RENDER_POSITION.AFTERBEGIN:
      container.prepend(child);
      break;
    case RENDER_POSITION.BEFOREEND:
      container.append(child);
      break;
    case RENDER_POSITION.AFTEREND:
      container.parentNode.insertBefore(child, container.nextSibling);
      break;
    case RENDER_POSITION.BEFORE:
      container.parentNode.insertBefore(child, container);
      break;
  }
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};
