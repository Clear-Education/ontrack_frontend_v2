export const convertDate = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export const convertDate2 = (date) => {
    let datearray = date.split("-");
    let newdate = datearray[0] + '/' + datearray[1] + '/' + datearray[2];
    return newdate;
}

export const convertDate3 = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1),d.getFullYear()].join("-");
}

export const convertDateToSend = (date) => {
    let datearray = date.split("-");
    let newdate = +datearray[2] + 1 + '/' + datearray[1] + '/' + datearray[0];
    return newdate;
}
