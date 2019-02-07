"use strict";
import "babel-polyfill";

// this class remove any given class passed as parameter from any HTML element passed as parameter as well
class ClassRemover {
  handleRemoveClass(element, className) {
    if (element.length > 1) {
      element.forEach(ele => ele.classList.remove(className));
    } else {
      element.classList.remove(className);
    }
  }

  handleAddClass(element, className) {
    element.classList.add(className);
  }

  setInnerHtml(element, textContent) {
    const elementLength = element.length;
    if (elementLength > 1) {
      element.forEach(ele => (ele.innerHTML = textContent));
    } else {
      element.innerHTML = textContent;
    }
  }

  classToggler(element, className) {
    element.classList.toggle(className);
  }

  //**
  //* handle an acive state on the element (elementToActivate) passed as third argument
  //* @param {NodeList} nodeElement
  //* @param {String} classToAdd
  //* @param {String} elementIdentifier (helps to target a specific element in the nodeList base on a unique class name)
  //*//
  handleActiveElement(nodeList, classToAdd, elementIdentifier) {
    nodeList.forEach(element => {
      if (element.classList.contains(elementIdentifier)) {
        element.classList.add(classToAdd);
      } else {
        element.classList.remove(classToAdd);
      }
    });
  }

  handleHasThisClass(element, className) {
    return element.classList.contains(className);
  }

  //
}

export default ClassRemover;
