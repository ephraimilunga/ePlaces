"use strcit";
import "babel-polyfill";
import { inputs, dropdownContainer } from "../components/globalSelect";

class HandleCloseDrop {
  closeDropdown(e) {
    // e.preventDefault();
    e.stopPropagation();
    const targetElement = e.target.classList;

    if (
      targetElement.contains("search_form_home") ||
      targetElement.contains("search_form_home_filters") ||
      targetElement.contains("search_result_main_title") ||
      targetElement.contains("main") ||
      targetElement.contains("submit_button") ||
      targetElement.contains("seach_result_details") ||
      targetElement.contains("fix_search_form") ||
      targetElement.contains("general_wrapper")
    ) {
      inputs.forEach(input => {
        input.classList.remove("arrow_up");
        input.classList.add("arrow_down");
      });

      dropdownContainer.forEach(dropdown => {
        dropdown.style.display = "none";
      });
    }
  }
}

export default HandleCloseDrop;
