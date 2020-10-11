/**
 * Adds Cero to number passes if its less than 10
 * @param {any} input
 */
const addCero = (input) => {
    return input < 10 ? "0" + input : input;
  };
  
  /**
   * Returns date formated
   * @param {any} dateToFormat - date object to format
   * @param {any} type - input type
   */
  export const convertDate = (dateToFormat, type) => {
    const date = new Date(dateToFormat);
    if (type === "date") {
      return [
        addCero(date.getDate()),
        addCero(date.getMonth() + 1),
        date.getFullYear(),
      ].join("/");
    } else if (type === "time") {
      return [addCero(date.getHours()), addCero(date.getMinutes())].join(":");
    } else {
      const newDate = [
        addCero(date.getDate()),
        addCero(date.getMonth() + 1),
        date.getFullYear(),
      ].join("/");
      const time = [addCero(date.getHours()), addCero(date.getMinutes())].join(
        ":"
      );
      return [newDate, time].join(" ");
    }
  };
  
  /**
   * Generate form data of passed object
   * @param {any} obj - object to add in FormData format
   */
  export const toFormData = (obj) => {
    const formData = new FormData();
    for (var i = 0; i < Object.keys(obj).length; i++) {
      formData.append(Object.keys(obj)[i], Object.values(obj)[i]);
    }
    return formData;
  };
  