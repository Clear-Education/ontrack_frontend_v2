export const convertDate2 = (date) => {
    let datearray = date.split("-");
    let newdate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
    return newdate;
}

export const convertDate = (inputFormat) => {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}